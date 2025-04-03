"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { carFormSchema } from "@/lib/zodCarSchema";
import ManualEntryForm from "./manual-entry-form";
import AiUploadForm from "./ai-upload-form";

const AddCarForm = () => {
  const [activeTab, setActiveTab] = useState("ai");
  const [uploadedImages, setUploadedImages] = useState([]);

  const {
    register,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      price: "",
      mileage: "",
      color: "",
      fuelType: "",
      transmission: "",
      bodyType: "",
      seats: "",
      description: "",
      status: "AVAILABLE",
      featured: false,
    },
  });

  return (
    <div>
      <Tabs
        defaultValue="ai"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mt-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="ai">AI Upload</TabsTrigger>
        </TabsList>
        {/* TAB CONTENT - MANUAL */}
        <TabsContent value="manual">
          {/* MANUAL CAR ENTRY FORM */}
          <ManualEntryForm
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            setValue={setValue}
            getValues={getValues}
            watch={watch}
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
          />
        </TabsContent>

        {/* TAB CONTENT - AI */}
        <TabsContent value="ai">
          {/* AI CAR FORM */}
          <AiUploadForm
            setUploadedImages={setUploadedImages}
            setActiveTab={setActiveTab}
            setValue={setValue}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddCarForm;
