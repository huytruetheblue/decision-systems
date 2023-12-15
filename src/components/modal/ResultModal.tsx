"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import React from "react";
import { Rating } from "react-simple-star-rating";
import { useModal } from "@/reduxs/use-modal-store";
import { Button } from "@/components/ui/button";

const ViewResultModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { tour } = data;

  const isModalOpen = isOpen && type === "resultModal";

  const getPrecriptionDetail = React.useCallback(async () => {}, []);

  React.useEffect(() => {
    getPrecriptionDetail();
  }, [getPrecriptionDetail]);

  const onSubmit = () => {
    window.open(tour?.Detail, "_blank");
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black py-5 px-10 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-3xl text-center font-bold w-full">
            Recommended Tour
          </DialogTitle>
        </DialogHeader>
        <div className="text-xl font-semibold">{tour?.Title}</div>
        <div className="flex">
          <span className="text-sm flex-1">City: {tour?.City}</span>
          <span className="text-sm">Category: {tour?.Category}</span>
        </div>

        <div className="flex align-center w-full">
          <Rating
            SVGstyle={{ display: "inline" }}
            size={20}
            readonly
            initialValue={tour?.Rating}
            transition
            allowFraction
          />

          <div className="flex-1">
            <span className="text-sm px-2 py-1">{tour?.Rating} / 5</span>
          </div>
          <span className="text-sm px-2 py-1">
            {tour?.Price.toLocaleString()}đ
          </span>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={onSubmit}>
            See more
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default ViewResultModal;
