import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DeleteReflectionButton } from '@/features/reflections/components/DeleteReflectionButton';
import { useReflections } from '@/features/reflections/hooks/useReflections';
import {
  Activity,
  ArrowRight,
  Calendar,
  CalendarRange,
  Compass,
  Dumbbell,
  Eye,
  MoreHorizontal,
  Moon,
  Search,
  Smile,
  Sparkles,
  Zap,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StatusState } from '@/components/common/StatusState';
import { devComponentAttrs } from '@/lib/devtools';

type SortOption = 'newest' | 'oldest';
type DateFilterOption = 'all' | '7d' | '30d' | '90d' | 'year';

const REFLECTIONS_PER_PAGE = 5;

function isWithinDateFilter(dateValue: string, filter: DateFilterOption) {
  if (filter === 'all') {
    return true;
  }

  const createdAt = new Date(dateValue);
  if (Number.isNaN(createdAt.getTime())) {
    return false;
  }

  const now = new Date();

  if (filter === 'year') {
    return createdAt.getFullYear() === now.getFullYear();
  }

  const daysMap: Record<Exclude<DateFilterOption, 'all' | 'year'>, number> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
  };

  const threshold = new Date(now);
  threshold.setDate(now.getDate() - (daysMap[filter] - 1));
  threshold.setHours(0, 0, 0, 0);

  return createdAt >= threshold;
}

function getVisiblePageNumbers(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
}

function isTodayReflection(dateValue: string) {
  const reflectionDate = new Date(dateValue);
  if (Number.isNaN(reflectionDate.getTime())) {
    return false;
  }

  const today = new Date();

  return (
    reflectionDate.getFullYear() === today.getFullYear() &&
    reflectionDate.getMonth() === today.getMonth() &&
    reflectionDate.getDate() === today.getDate()
  );
}

export default function ReflectionsPage() {
  const navigate = useNavigate();
  const { data: reflections, isLoading, error } = useReflections();
  const reflectionList = useMemo(() => reflections ?? [], [reflections]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionsReflectionId, setOpenActionsReflectionId] = useState<string | null>(null);
  const editableReflectionId = useMemo(
    () => reflectionList.find((reflection) => isTodayReflection(reflection.created_at))?.id,
    [reflectionList]
  );

  const filteredAndSortedReflections = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = reflectionList.filter((reflection) => {
      const matchesDateFilter = isWithinDateFilter(reflection.created_at, dateFilter);
      if (!matchesDateFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const reflectionDateLabel = new Date(reflection.created_at).toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      return (
        reflection.journal_text.toLowerCase().includes(normalizedQuery) ||
        reflectionDateLabel.toLowerCase().includes(normalizedQuery)
      );
    });

    return [...filtered].sort((a, b) => {
      const aTime = new Date(a.created_at).getTime();
      const bTime = new Date(b.created_at).getTime();

      return sortBy === 'newest' ? bTime - aTime : aTime - bTime;
    });
  }, [dateFilter, reflectionList, searchQuery, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedReflections.length / REFLECTIONS_PER_PAGE)
  );
  const activePage = Math.min(currentPage, totalPages);

  const paginatedReflections = useMemo(() => {
    const start = (activePage - 1) * REFLECTIONS_PER_PAGE;
    return filteredAndSortedReflections.slice(start, start + REFLECTIONS_PER_PAGE);
  }, [activePage, filteredAndSortedReflections]);

  const visiblePageNumbers = useMemo(
    () => getVisiblePageNumbers(activePage, totalPages),
    [activePage, totalPages]
  );

  if (isLoading) {
    return (
      <PageContainer {...devComponentAttrs('ReflectionsPage')}>
        <div className="mx-auto max-w-lg">
          <StatusState
            title="Gathering your reflections"
            description="We’re bringing your reflection history into view."
          />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="mx-auto max-w-lg">
          <StatusState title="We couldn’t load your reflections" description={error.message} />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Your Reflections"
        description="A gentle record of what you've noticed over time."
      />

      {reflectionList.length === 0 ? (
        <div className="w-full" {...devComponentAttrs('ReflectionsPage.EmptyState')}>
          <StatusState
            title="No reflections yet"
            description="Your reflections will appear here once you start writing."
            action={
              <Button asChild className="w-full sm:w-auto">
                <Link to="/reflect">Start your first reflection</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <div className="space-y-5" {...devComponentAttrs('ReflectionsPage.List')}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Select
                value={sortBy}
                onValueChange={(value) => {
                  setSortBy(value as SortOption);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full min-w-45 sm:w-45">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={dateFilter}
                onValueChange={(value) => {
                  setDateFilter(value as DateFilterOption);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full min-w-45 sm:w-45">
                  <CalendarRange className="size-4 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="year">This year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search reflections..."
                className="h-10 pl-9"
                aria-label="Search reflections"
              />
            </div>
          </div>

          {paginatedReflections.length === 0 ? (
            <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              No reflections match your current filters.
            </p>
          ) : (
            <div className="space-y-4">
              {paginatedReflections.map((reflection) => (
                <Card
                  key={reflection.id}
                  className="rounded-lg border bg-card py-0 text-card-foreground shadow-sm"
                >
                  <CardHeader className="pt-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(reflection.created_at).toLocaleDateString('en-ZA', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <DropdownMenu
                        open={openActionsReflectionId === reflection.id}
                        onOpenChange={(open) => {
                          setOpenActionsReflectionId(open ? reflection.id : null);
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="-mt-2">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuItem
                            onSelect={() => {
                              navigate(`/reflections/${reflection.id}`);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                            View insight
                          </DropdownMenuItem>

                          {reflection.id === editableReflectionId ? (
                            <DropdownMenuItem
                              onSelect={() => {
                                navigate('/reflect');
                              }}
                            >
                              <Sparkles className="h-4 w-4" />
                              Edit reflection
                            </DropdownMenuItem>
                          ) : null}

                          <DropdownMenuSeparator />

                          <DeleteReflectionButton
                            reflectionId={reflection.id}
                            hideErrorText
                            triggerAsChild
                            onDeleted={() => {
                              setOpenActionsReflectionId(null);
                              setCurrentPage((page) => Math.max(1, page));
                            }}
                            onCancel={() => {
                              setOpenActionsReflectionId(null);
                            }}
                          >
                            <DropdownMenuItem
                              variant="destructive"
                              onSelect={(event) => {
                                event.preventDefault();
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete reflection
                            </DropdownMenuItem>
                          </DeleteReflectionButton>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="mt-1 whitespace-pre-wrap leading-8">
                      {reflection.journal_text || 'No reflection text saved.'}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Moon className="h-3.5 w-3.5 text-violet-400" />
                        Sleep {reflection.sleep_hours ?? '—'}
                      </span>
                      <span className="text-border">|</span>
                      <span className="inline-flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 text-amber-400" />
                        Energy {reflection.energy ?? '—'}
                      </span>
                      <span className="text-border">|</span>
                      <span className="inline-flex items-center gap-1.5">
                        <Smile className="h-3.5 w-3.5 text-amber-300" />
                        Mood {reflection.mood ?? '—'}
                      </span>
                      <span className="text-border">|</span>
                      <span className="inline-flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-emerald-400" />
                        Stress {reflection.stress ?? '—'}
                      </span>
                      <span className="text-border">|</span>
                      <span className="inline-flex items-center gap-1.5">
                        <Dumbbell className="h-3.5 w-3.5 text-cyan-400" />
                        Exercise {reflection.exercised ? 'Yes' : 'No'}
                      </span>
                    </div>

                    <div className="mt-5 mb-4 border-t pt-4">
                      {reflection.hasInsight ? (
                        <Link
                          to={`/reflections/${reflection.id}`}
                          className="group inline-flex items-center gap-2 text-primary transition-colors hover:text-primary/80 hover:underline"
                        >
                          <Compass className="h-4 w-4 transition-transform group-hover:rotate-6" />
                          <span className="font-medium">Read Another Perspective</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="group inline-flex items-center gap-2 text-primary transition-colors hover:text-primary/80 hover:underline"
                          onClick={() =>
                            navigate(`/reflections/${reflection.id}`, {
                              state: {
                                autoGenerateInsight: true,
                              },
                            })
                          }
                        >
                          <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110" />
                          <span className="font-medium">Generate AI Insight</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex flex-col items-center gap-3 pt-2">
            <p className="text-xs text-muted-foreground">
              Showing{' '}
              {Math.min(
                (activePage - 1) * REFLECTIONS_PER_PAGE + 1,
                filteredAndSortedReflections.length
              )}
              -{Math.min(activePage * REFLECTIONS_PER_PAGE, filteredAndSortedReflections.length)} of{' '}
              {filteredAndSortedReflections.length}
            </p>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className={activePage === 1 ? 'pointer-events-none opacity-50' : ''}
                    onClick={(event) => {
                      event.preventDefault();
                      setCurrentPage((page) => Math.max(1, page - 1));
                    }}
                  />
                </PaginationItem>

                {visiblePageNumbers.map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={pageNumber === activePage}
                      onClick={(event) => {
                        event.preventDefault();
                        setCurrentPage(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    className={activePage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    onClick={(event) => {
                      event.preventDefault();
                      setCurrentPage((page) => Math.min(totalPages, page + 1));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
