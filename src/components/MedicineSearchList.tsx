import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { Loader2 } from "lucide-react";
import MedicineDisplayCard from "./MedicineDisplayCard";

export default function MedicineSearchList({ start }: { start: string }) {
  const { data, isLoading, fetchNextPage, hasNextPage } =
    api.medicine.searchMedicineByName.useInfiniteQuery(
      {
        limit: 20,
        start,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        // initialCursor: 1, // <-- optional you can pass an initialCursor
      },
    );
  return (
    <>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : data === undefined || data.pages[0]?.items.length === 0 ? (
        <div className="w-full text-center text-xl">No Medicine found</div>
      ) : (
        <div className="grid w-full grid-cols-2 gap-2 p-2">
          {data.pages.map((da) =>
            da.items.map((d) => (
              <MedicineDisplayCard
                name={d.name}
                mrp={d.mrp}
                sp={d.sp}
                discount={d.discount}
                id={d.id}
                key={d.id}
                addToCart={true}
              />
            )),
          )}
        </div>
      )}
      {!isLoading && (
        <div className="my-4 text-center">
          <Button
            disabled={isLoading || !hasNextPage}
            variant="secondary"
            onClick={() => fetchNextPage()}
          >
            Load More
          </Button>
        </div>
      )}
    </>
  );
}
