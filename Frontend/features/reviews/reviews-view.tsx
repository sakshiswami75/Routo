"use client";

import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading";
import { useAsync } from "@/hooks/use-async";
import { shortDate } from "@/lib/utils";
import { reviewService } from "@/services/review.service";

export function ReviewsView() {
  const { data, error, isLoading, refetch } = useAsync(() => reviewService.getMyReviews());

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold md:text-4xl">Reviews</h1>
        <p className="text-on-surface-variant">Reviews you have received as a carrier.</p>
      </header>
      {data?.length ? (
        <section className="grid gap-6 md:grid-cols-2">
          {data.map((review) => (
            <Card className="p-6" key={review.id}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex gap-1 text-secondary-container">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star className="h-5 w-5" fill={index < review.rating ? "currentColor" : "none"} key={index} />
                  ))}
                </div>
                <span className="font-geist text-xs text-outline">{shortDate(review.createdAt)}</span>
              </div>
              <p className="text-on-surface">{review.comment || "No written comment."}</p>
              <p className="mt-4 font-geist text-xs font-semibold uppercase text-on-surface-variant">
                Delivery {review.deliveryId.slice(0, 8)}
              </p>
            </Card>
          ))}
        </section>
      ) : (
        <EmptyState title="No reviews yet" description="Delivered parcels can be reviewed by senders once the backend has review creation data." />
      )}
    </div>
  );
}
