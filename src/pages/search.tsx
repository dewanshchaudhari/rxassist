import React from "react";
import MedicineSearchList from "@/components/MedicineSearchList";
import { InputWithIcon } from "@/components/ui/input";

export default function Search() {
  const [search, setSearch] = React.useState<string>("");
  return (
    <div>
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
