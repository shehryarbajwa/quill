'use client';

import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useToast } from './ui/use-toast';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import {
  ChevronDown,
  ChevronUp,
  RotateCw,
  Search,
  ZoomIn,
  ZoomOut,
  Menu as MenuIcon,
  Fullscreen,
} from 'lucide-react';
import { useResizeDetector } from 'react-resize-detector';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import SimpleBar from 'simplebar-react';
import PdfFullScreen from './PdfFullScreen';
import { Loader2 } from 'lucide-react';
import { trpc } from '@/app/_trpc/client';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfRendererProps {
  url: string;
}

// Combined Schema
const CombinedValidator = z.object({
  page: z
    .string()
    .optional()
    .refine((num) => !num || (Number(num) > 0 && Number(num) <= 1000), {
      // Example max page number
      message: 'Invalid page number',
    }),
  search: z
    .string()
    .regex(/^[a-zA-Z0-9\s\+\-\*\/%=<>!\(\)';.,]*$/, {
      // Regex for numbers, strings, and simple SQL formulas
      message: 'Invalid search query',
    })
    .optional(),
});

type TCombinedValidator = z.infer<typeof CombinedValidator>;

const PdfRenderer = ({ url }: PdfRendererProps) => {
  const { toast } = useToast();

  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);
  const [isTextareaVisible, setIsTextareaVisible] = useState(false);
  const [searchArea, setSearchArea] = useState<string | undefined>('');
  const isLoading = renderedScale !== scale;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCombinedValidator>({
    defaultValues: {
      page: '1',
      search: '',
    },
    resolver: zodResolver(CombinedValidator),
  });

  const { width, ref } = useResizeDetector();

  const handlePageSubmit = ({ page }: TCombinedValidator) => {
    setCurrentPage(Number(page));
    setValue('page', String(page));
  };

  const handleSearchSubmit = ({ search }: TCombinedValidator) => {
    setSearchArea(search);

    if (!search) return;

    const { data, error } = trpc.getSearchResults.useQuery(search);

    console.log('data', data);
  };

  const handleFormSubmit = (data: TCombinedValidator) => {
    if (data.page) {
      handlePageSubmit(data);
    } else if (data.search) {
      handleSearchSubmit(data);
    }
  };

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-gray-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1">
          <Button
            disabled={currentPage <= 1}
            onClick={() =>
              setCurrentPage((prev) => (prev - 1 > 1 ? prev - 1 : 1))
            }
            variant="ghost"
            aria-label="previous page"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Input
              {...register('page')}
              className={`w-12 h-8 ${
                errors.page ? 'focus-visible:ring-red-500' : ''
              }`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(handleFormSubmit)();
                }
              }}
            />
            <p className="text-gray-700 text-sm">
              <span>/</span>
              <span className="ml-2">{numPages}</span>
            </p>
          </div>
          <Button
            disabled={numPages === undefined || currentPage === numPages}
            onClick={() => {
              setCurrentPage((prev) =>
                prev + 1 > numPages! ? numPages! : prev + 1
              );
              setValue('page', String(currentPage + 1));
            }}
            variant="ghost"
            aria-label="next page"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setIsTextareaVisible(!isTextareaVisible)}
            variant="ghost"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        {isTextareaVisible && (
          <div className="flex items-center gap-1.5">
            <Input
              {...register('search')}
              className="h-10 sm:w-20 md:w-40 lg:w-60 border border-gray-300 rounded-md"
              placeholder="Search PDF"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(handleSearchSubmit)();
                }
              }}
            />
            {errors.search && (
              <p className="text-red-500 text-sm">{errors.search.message}</p>
            )}
          </div>
        )}
        <div className="space-x-2 hidden sm:flex items-center">
          <div className="space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="md:min-h-2 gap-1.5"
                  aria-label="zoom"
                  variant="ghost"
                >
                  <ZoomIn className="h-4 w-4 gap-2" />
                  {scale * 100}%
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setScale(1)}>
                  100%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(1.5)}>
                  150%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(2)}>
                  200%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(2.5)}>
                  250%
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              aria-label="rotate 90 degrees"
              onClick={() => setRotation((prev) => prev + 90)}
            >
              <RotateCw className="h-4 w-4"></RotateCw>
            </Button>
          </div>
          <PdfFullScreen fileUrl={url} />

          {/* Hamburger menu for small screens */}
          <div className="md:hidden flex items-center gap-2">
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton aria-label="menu">
                <MenuIcon className="h-6 w-6" />
              </MenuButton>
              <MenuItems
                anchor="bottom"
                className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none"
              >
                <div className="py-1">
                  <MenuItem>
                    {({ active }) => (
                      <Button
                        variant="ghost"
                        aria-label="zoom in"
                        onClick={() =>
                          setScale((prev) => (prev < 2.5 ? prev + 0.5 : prev))
                        }
                        className={`w-full text-left ${
                          active ? 'bg-gray-100' : ''
                        }`}
                      >
                        <ZoomIn className="h-4 w-4 mr-2" /> Zoom In
                      </Button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <Button
                        variant="ghost"
                        aria-label="zoom out"
                        onClick={() =>
                          setScale((prev) => (prev > 1 ? prev - 0.5 : prev))
                        }
                        className={`w-full text-left ${
                          active ? 'bg-gray-100' : ''
                        }`}
                      >
                        <ZoomOut className="h-4 w-4 mr-2" /> Zoom Out
                      </Button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <Button
                        variant="ghost"
                        aria-label="rotate 90 degrees"
                        onClick={() => setRotation((prev) => prev + 90)}
                        className={`w-full text-left ${
                          active ? 'bg-gray-100' : ''
                        }`}
                      >
                        <RotateCw className="h-4 w-4 mr-2" /> Rotate
                      </Button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <Button
                        variant="ghost"
                        aria-label="rotate 90 degrees"
                        className={`w-full text-left ${
                          active ? 'bg-gray-100' : ''
                        }`}
                      >
                        <Fullscreen className="h-4 w-4 mr-2" /> Full Screen
                        <PdfFullScreen fileUrl={url} />
                      </Button>
                    )}
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadError={() => {
                toast({
                  title: 'Error loading PDF',
                  description: 'Please try again later',
                  variant: 'destructive',
                });
              }}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              file={url}
              className="max-h-full"
            >
              {isLoading && renderedScale ? (
                <Page
                  width={width ? width : 1}
                  pageNumber={currentPage}
                  scale={scale}
                  rotate={rotation}
                  key={'@' + renderedScale}
                />
              ) : null}

              <Page
                className={cn(isLoading ? 'hidden' : '')}
                width={width ? width : 1}
                pageNumber={currentPage}
                scale={scale}
                rotate={rotation}
                key={'@' + scale}
                loading={
                  <div className="flex justify-center">
                    <Loader2 className="my-24 h-6 w-6 animate-spin"></Loader2>
                  </div>
                }
                onRenderSuccess={() => setRenderedScale(scale)}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRenderer;
