import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useRef, useState } from 'react';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ModernTextInput } from '../ModernTextInput';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateFormData } from '@/store/challengeSlice';
import { BottomSheetInfo } from '../BottomSheetInfo';
import { Image as ImageIcon, UploadCloud } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

type DetailsField = {
  name: string;
  label: string;
  subtitle?: string;
};

type DetailsQuestion = {
  name: string;
  label: string;
  fields?: DetailsField[];
  subtitle?: string;
  render?: any;
};

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  headline: z.string().min(1, 'Headline is required'),
  summary: z.string().min(1, 'Summary is required'),
  image: z.string().optional(),
  heroImage: z.string().optional(),
  enrollmentStartDate: z.string().min(1, 'Enrollment start date is required'),
  enrollmentEndDate: z.string().min(1, 'Enrollment end date is required'),
  challengeStartDate: z.string().min(1, 'Challenge start date is required'),
  challengeEndDate: z.string().min(1, 'Challenge end date is required'),
}).refine((data) => {
  // Validate enrollment dates
  if (data.enrollmentStartDate && data.enrollmentEndDate) {
    const start = new Date(data.enrollmentStartDate);
    const end = new Date(data.enrollmentEndDate);
    if (start > end) {
      return false;
    }
  }
  // Validate challenge dates
  if (data.challengeStartDate && data.challengeEndDate) {
    const start = new Date(data.challengeStartDate);
    const end = new Date(data.challengeEndDate);
    if (start > end) {
      return false;
    }
  }
  // Validate that challenge starts after enrollment ends
  if (data.enrollmentEndDate && data.challengeStartDate) {
    const enrollmentEnd = new Date(data.enrollmentEndDate);
    const challengeStart = new Date(data.challengeStartDate);
    if (enrollmentEnd > challengeStart) {
      return false;
    }
  }
  return true;
}, {
  message: "Please ensure dates are in the correct order",
  path: ["challengeStartDate"]
});

const questions: DetailsQuestion[] = [
  {
    name: 'basicDetails',
    label: 'Challenge Details',
    fields: [
      { name: 'name', label: 'What is the name of your challenge?' },
      { name: 'headline', label: 'What is the headline for your challenge?' },
      { name: 'summary', label: 'Write a short summary for your challenge.' },
    ],
  },
  {
    name: 'images',
    label: 'Challenge Images',
    fields: [
      { name: 'image', label: 'Upload an image for your challenge.', subtitle: 'recommended size: 800x600px' },
      { name: 'heroImage', label: 'Upload a hero image for your challenge.', subtitle: 'recommended size: 1920x600px' },
    ],
  },
  {
    name: 'enrollment',
    label: 'Set the enrollment period',
    fields: [
      { name: 'enrollmentStartDate', label: 'Enrollment Start Date' },
      { name: 'enrollmentEndDate', label: 'Enrollment End Date' },
    ],
  },
  {
    name: 'challenge',
    label: 'Set the challenge period',
    fields: [
      { name: 'challengeStartDate', label: 'Challenge Start Date' },
      { name: 'challengeEndDate', label: 'Challenge End Date' },
    ],
  },
];

export function useDetailsForm() {
  const { formData } = useAppSelector((state) => state.challenge);
  
  return useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: formData.details?.name || '',
      headline: formData.details?.headline || '',
      summary: formData.details?.summary || '',
      image: formData.details?.image || '',
      heroImage: formData.details?.heroImage || '',
      enrollmentStartDate: formData.details?.enrollmentStartDate || '',
      enrollmentEndDate: formData.details?.enrollmentEndDate || '',
      challengeStartDate: formData.details?.challengeStartDate || '',
      challengeEndDate: formData.details?.challengeEndDate || '',
    },
    mode: 'onChange',
  });
}

export const DETAILS_TOTAL = questions.length;

export function DetailsStep({ subStep, form }: { subStep: number; form: ReturnType<typeof useDetailsForm> }) {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.challenge);
  const [calendarField, setCalendarField] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<'image' | 'heroImage' | null>(null);

  useEffect(() => {
    const subscription = form.watch((value) => {
      dispatch(updateFormData({
        details: {
          name: value.name || '',
          headline: value.headline || '',
          summary: value.summary || '',
          image: value.image || '',
          heroImage: value.heroImage || '',
          enrollmentStartDate: value.enrollmentStartDate || '',
          enrollmentEndDate: value.enrollmentEndDate || '',
          challengeStartDate: value.challengeStartDate || '',
          challengeEndDate: value.challengeEndDate || '',
        }
      }));
    });
    return () => subscription.unsubscribe();
  }, [form, dispatch]);

  useEffect(() => {
    const el = document.querySelector('input,select,button[aria-pressed]');
    if (el) (el as HTMLElement).focus();
  }, [subStep]);

  const handleBrowse = (field: 'image' | 'heroImage') => {
    setCurrentImageField(field);
    setShowBottomSheet(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          // Update form with file URL (in real app, this would be the uploaded file URL)
          if (currentImageField) {
            form.setValue(currentImageField, URL.createObjectURL(file));
          }
          setShowBottomSheet(false);
          setSelectedFile(null);
          setUploadProgress(0);
        }
      }, 200);
    }
  };

  // Helper to parse and format date
  function formatDate(dateStr: string) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString();
  }

  const currentQuestion = questions[subStep];
  const currentValue = form.watch(currentQuestion.name as any);

  // Handle grouped fields
  if (currentQuestion.fields && (currentQuestion.name === 'basicDetails' || currentQuestion.name === 'images')) {
    return (
      <Form {...form}>
        <div className="space-y-6">
          <FormLabel className="text-xl font-semibold mb-2 block">{currentQuestion.label}</FormLabel>
          {currentQuestion.fields.map((field) => {
            if (field.name === 'name') {
              return (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name as any}
                  render={({ field: f, fieldState }) => (
                    <FormItem>
                      <FormLabel className="font-medium mb-2 block">{field.label}</FormLabel>
                      <ModernTextInput
                        value={f.value || ''}
                        onChange={f.onChange}
                        maxLength={40}
                        error={fieldState?.error?.message}
                        label=""
                        placeholder="Enter challenge name"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            }
            if (field.name === 'headline') {
              return (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name as any}
                  render={({ field: f, fieldState }) => (
                    <FormItem>
                      <FormLabel className="font-medium mb-2 block">{field.label}</FormLabel>
                      <Textarea
                        value={f.value || ''}
                        onChange={f.onChange}
                        maxLength={55}
                        rows={2}
                        className="w-full h-32"
                        placeholder="Enter headline"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            }
            if (field.name === 'summary') {
              return (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name as any}
                  render={({ field: f, fieldState }) => (
                    <FormItem>
                      <FormLabel className="font-medium mb-2 block">{field.label}</FormLabel>
                      <Textarea
                        value={f.value || ''}
                        onChange={f.onChange}
                        maxLength={120}
                        rows={3}
                        className="w-full h-32"
                        placeholder="Enter summary"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            }
            if (field.name === 'image' || field.name === 'heroImage') {
              return (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name as any}
                  render={({ field: f, fieldState }) => (
                    <FormItem>
                      <FormLabel className="font-medium mb-2 block">{field.label}</FormLabel>
                      {field.subtitle && (
                        <p className="text-muted-foreground mb-4">{field.subtitle}</p>
                      )}
                      <div
                        className="border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => handleBrowse(field.name as 'image' | 'heroImage')}
                      >
                        {f.value ? (
                          <img
                            src={f.value}
                            alt="Preview"
                            className="max-w-full h-auto rounded-lg mb-4"
                          />
                        ) : (
                          <div className="space-y-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                              <svg
                                className="w-6 h-6 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-lg font-medium">Click to upload</p>
                              <p className="text-sm text-muted-foreground">
                                or drag and drop
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            }
            return null;
          })}
        </div>
        <BottomSheetInfo
          open={showBottomSheet}
          onOpenChange={setShowBottomSheet}
          title="Upload Image"
        >
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <Button
              onClick={() => document.getElementById('file-upload')?.click()}
              className="w-full"
            >
              Browse Files
            </Button>
            {selectedFile && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Uploading {selectedFile.name}...
                </p>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </BottomSheetInfo>
      </Form>
    );
  }

  // Handle timeline fields
  if (currentQuestion.name === 'enrollment' || currentQuestion.name === 'challenge') {
    if (!currentQuestion.fields) return null;
    return (
      <Form {...form}>
        <div className="space-y-6">
          <FormLabel className="text-xl font-semibold mb-2 block">{currentQuestion.label}</FormLabel>
          {currentQuestion.name === 'enrollment' && (
            <p className="text-muted-foreground mb-6 text-base">
              Set the window during which users can enroll in your challenge. Enrollment Start Date is when sign-ups open, and Enrollment End Date is when sign-ups close.
            </p>
          )}
          {currentQuestion.name === 'challenge' && (
            <p className="text-muted-foreground mb-6 text-base">
              Set the period during which the challenge will be active. Challenge Start Date is when the challenge begins, and Challenge End Date is when it ends for all participants.
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentQuestion.fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name as any}
                render={({ field: f, fieldState }) => (
                  <FormItem>
                    <FormLabel className="font-medium mb-2 block">{field.label}</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full flex justify-between items-center py-6 px-6 rounded-3xl text-lg bg-white shadow-sm mb-2",
                        fieldState.error && "border-destructive"
                      )}
                      onClick={() => {
                        setCalendarField(field.name);
                        setCalendarOpen(true);
                      }}
                    >
                      {formatDate(f.value) || `MM/DD/YYYY`}
                      <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
        <BottomSheetInfo
          open={calendarOpen}
          onOpenChange={(open) => setCalendarOpen(open)}
          title={calendarField ? questions.find(q => q.fields?.some(f => f.name === calendarField))?.fields?.find(f => f.name === calendarField)?.label || '' : ''}
        >
          <Calendar
            mode="single"
            selected={
              calendarField
                ? (form.watch(calendarField as any)
                    ? new Date(form.watch(calendarField as any) as string)
                    : undefined)
                : undefined
            }
            onSelect={(date) => {
              if (calendarField && date) {
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const dd = String(date.getDate()).padStart(2, '0');
                form.setValue(calendarField as any, `${yyyy}-${mm}-${dd}`);
                form.trigger(calendarField as any); // Trigger validation after setting value
                setCalendarOpen(false);
              }
            }}
            initialFocus
          />
        </BottomSheetInfo>
      </Form>
    );
  }

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name={currentQuestion.name as any}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="text-xl font-semibold mb-2 block">{currentQuestion.label}</FormLabel>
            {currentQuestion.subtitle && (
              <p className="text-muted-foreground mb-4">{currentQuestion.subtitle}</p>
            )}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentQuestion.name}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                {currentQuestion.render && currentQuestion.render({ ...field, value: currentValue }, form, fieldState)}
              </motion.div>
            </AnimatePresence>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
} 