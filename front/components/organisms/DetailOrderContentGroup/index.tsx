"use client";
import CustomIcon from "@/components/atoms/CustomIcon";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { DetailOrderTableGroup } from "../DetailOrderTableGroup";

export default function DetailOrdeContentGroup() {
  return (
    <div className="mt-4 bg-white p-5 rounded-xl">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="Tìm kiếm"
            classNames={{
              inputWrapper: "lg:min-w-[425px] bg-white border-[1px] border-semi-translucent-black rounded-[32px]"
            }}
            startContent={
              <CustomIcon name="search"/>
            }
          />
          <Select
            placeholder="Trạng thái"
            disableSelectorIconRotation
            selectorIcon={<CustomIcon name="caret-down"/>}
            className="lg:min-w-[140px]"
          >
            <SelectItem key={"doing"}>
              Đang TT
            </SelectItem>
            <SelectItem key={"success"}>
              Thành Công
            </SelectItem>
            <SelectItem key={"open"}>
              Khởi tạo
            </SelectItem>
            <SelectItem key={"cancel"}>
              Đã hủy
            </SelectItem>
          </Select>
        </div>
        <Select
          placeholder="Cột"
          className="max-w-[90px]"
          disableSelectorIconRotation
          selectorIcon={<CustomIcon name="caret-down"/>}
          classNames={{
            popoverContent: "w-auto"
          }}
        >
          <SelectItem key={"1"}>
            animal.label2
          </SelectItem>
          <SelectItem key={"2"}>
            animal.label1
          </SelectItem>
        </Select>
      </div>
      <div className="mt-3">
        <DetailOrderTableGroup />
      </div>
    </div>
  );
}
