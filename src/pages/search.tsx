import React from "react";
import MedicineSearchList from "@/components/MedicineSearchList";
import { InputWithIcon } from "@/components/ui/input";
import useMediaQuery from "@/hooks/mediaQuery";

export default function Search() {
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [search, setSearch] = React.useState<string>("");
  return (
    <div className={!isMobile ? "mx-auto w-[70%]" : ""}>
      <div className="p-4">
        <InputWithIcon
          placeholder="What are you looking for?"
          onChangeCapture={(e) => setSearch(e.currentTarget.value)}
          autoFocus={true}
        />
      </div>
      {/* <SearchInput /> */}
      <MedicineSearchList start={search} />
    </div>
  );
}
