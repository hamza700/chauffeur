import dayjs from 'dayjs';
import { z as zod } from 'zod';

// ----------------------------------------------------------------------

// const isSsr = typeof window === 'undefined';

type InputProps = {
  message?: {
    required_error?: string;
    invalid_type_error?: string;
  };
  minFiles?: number;
  isValidPhoneNumber?: (text: string) => boolean;
};

export const schemaHelper = {
  /**
   * Phone number
   * defaultValue === null
   */
  phoneNumber: (props?: InputProps) =>
    zod
      .string()
      .min(1, { message: props?.message?.required_error ?? 'Phone number is required!' })
      .refine((data) => props?.isValidPhoneNumber?.(data), {
        message: props?.message?.invalid_type_error ?? 'Invalid phone number!',
      }),
  /**
   * date
   * defaultValue === null
   */
  date: (props?: InputProps) =>
    zod.coerce
      .date()
      .nullable()
      .transform((dateString, ctx) => {
        const date = dayjs(dateString).format();

        const stringToDate = zod.string().pipe(zod.coerce.date());

        if (!dateString) {
          ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: props?.message?.required_error ?? 'Date is required!',
          });
          return null;
        }

        if (!stringToDate.safeParse(date).success) {
          ctx.addIssue({
            code: zod.ZodIssueCode.invalid_date,
            message: props?.message?.invalid_type_error ?? 'Invalid Date!!',
          });
        }

        return date;
      })
      .pipe(zod.union([zod.number(), zod.string(), zod.date(), zod.null()])),
  /**
   * editor
   * defaultValue === '' | <p></p>
   */
  editor: (props?: InputProps) =>
    zod.string().min(8, { message: props?.message?.required_error ?? 'Editor is required!' }),
  /**
   * object
   * defaultValue === null
   */
  objectOrNull: <T>(props?: InputProps) =>
    zod
      .custom<T>()
      .refine((data) => data !== null, {
        message: props?.message?.required_error ?? 'Field is required!',
      })
      .refine((data) => data !== '', {
        message: props?.message?.required_error ?? 'Field is required!',
      }),
  /**
   * boolean
   * defaultValue === false
   */
  boolean: (props?: InputProps) =>
    zod.coerce.boolean().refine((bool) => bool === true, {
      message: props?.message?.required_error ?? 'Switch is required!',
    }),
  /**
   * file
   * defaultValue === '' || null
   */
  file: (props?: InputProps & { optional?: boolean }) =>
    zod.custom<File | string | null>().transform((data, ctx) => {
      // If data is null/empty and optional is true, return null without error
      if ((!data || data === '') && props?.optional) {
        return null;
      }

      const hasFile = data instanceof File || (typeof data === 'string' && !!data.length);

      if (!hasFile && !props?.optional) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: props?.message?.required_error ?? 'File is required!',
        });
        return null;
      }

      return data;
    }),
  /**
   * files
   * defaultValue === []
   */
  files: (props?: InputProps & { optional?: boolean }) =>
    zod.array(zod.custom<File | string>()).transform((data, ctx) => {
      // If array is empty and optional is true, return empty array without error
      if (!data.length && props?.optional) {
        return data;
      }

      const minFiles = props?.minFiles ?? 2;

      if (!data.length && !props?.optional) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: props?.message?.required_error ?? 'Files is required!',
        });
      } else if (!props?.optional && data.length < minFiles) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: `Must have at least ${minFiles} items!`,
        });
      }

      return data;
    }),
};
