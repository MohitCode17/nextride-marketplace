import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  bikeTypesVal,
  fuelTypes,
  rideStatuses,
  transmissions,
} from "@/lib/data";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import useFetch from "@/hooks/use-fetch";
import { addRide } from "@/actions/rides";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const ManualEntryForm = ({
  register,
  errors,
  handleSubmit,
  setValue,
  getValues,
  watch,
  uploadedImages,
  setUploadedImages,
}) => {
  const router = useRouter();
  const [imageError, setImageError] = useState("");

  // IMAGE UPLOAD LOGIC
  const onMultiImageDrop = (acceptedFiles) => {
    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit and will be skipped`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newImages = [];

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push(e.target.result);

        // WHEN ALL IMAGES ARE PROCESSED
        if (newImages.length === validFiles.length) {
          setUploadedImages((prev) => [...prev, ...newImages]);
          setImageError("");
          toast.success(`Successfully uploaded ${validFiles.length} images`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const {
    getRootProps: getMultiImageRootProps,
    getInputProps: getMultiImageInputProps,
  } = useDropzone({
    onDrop: onMultiImageDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
  });

  // HANDLE REMOVE IMAGE(MANUAL)
  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // CALL ADDCAR API
  const { loading, fn: addRideFn, data: addRideResult } = useFetch(addRide);

  // HANDLE FORM SUBMIT
  const onSubmit = async (data) => {
    if (uploadedImages.length === 0) {
      setImageError("Please upload at least one image");
      return;
    }

    const rideData = {
      ...data,
      year: parseInt(data.year),
      price: parseFloat(data.price),
      mileage: parseInt(data.mileage),
      seats: data.seats ? parseInt(data.seats) : null,
    };

    // CALL THE DATA TO FUNCTION WITH OUR USEFETCH HOOK
    await addRideFn({
      rideData,
      images: uploadedImages,
    });
  };

  // HANDLE SUCCESSFUL CAR ADDITION(MANUAL)
  useEffect(() => {
    if (addRideResult?.success) {
      toast.success("Ride added successfully.");
      router.push("/admin/rides");
    }
  }, [addRideResult, loading, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ride Details</CardTitle>
        <CardDescription>
          Enter the details of the ride you want to add.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* MAKE */}
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                {...register("make")}
                placeholder="e.g. Yamaha"
                className={errors.make ? "border-red-500" : ""}
              />
              {errors.make && (
                <p className="text-xs text-red-500">{errors.make.message}</p>
              )}
            </div>

            {/* MODEL */}
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                {...register("model")}
                placeholder="e.g. R15"
                className={errors.model ? "border-red-500" : ""}
              />
              {errors.model && (
                <p className="text-xs text-red-500">{errors.model.message}</p>
              )}
            </div>

            {/* YEAR */}
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                {...register("year")}
                placeholder="e.g. 2024"
                className={errors.year ? "border-red-500" : ""}
              />
              {errors.year && (
                <p className="text-xs text-red-500">{errors.year.message}</p>
              )}
            </div>

            {/* PRICE */}
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                {...register("price")}
                placeholder="e.g. 185000"
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <p className="text-xs text-red-500">{errors.price.message}</p>
              )}
            </div>

            {/* MILEAGE */}
            <div className="space-y-2">
              <Label htmlFor="mileage">
                Mileage{" "}
                <span className="text-sm text-gray-500">(In Number)</span>
              </Label>
              <Input
                id="mileage"
                {...register("mileage")}
                placeholder="e.g. 45"
                className={errors.mileage ? "border-red-500" : ""}
              />
              {errors.mileage && (
                <p className="text-xs text-red-500">{errors.mileage.message}</p>
              )}
            </div>

            {/* COLOR */}
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                {...register("color")}
                placeholder="e.g. Blue"
                className={errors.color ? "border-red-500" : ""}
              />
              {errors.color && (
                <p className="text-xs text-red-500">{errors.color.message}</p>
              )}
            </div>

            {/* FUEL TYPE */}
            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>

              <Select
                defaultValue={getValues("fuelType")}
                onValueChange={(value) => setValue("fuelType", value)}
              >
                <SelectTrigger
                  className={`${
                    errors.fuelType ? "border-red-500" : ""
                  } w-full`}
                >
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.fuelType && (
                <p className="text-xs text-red-500">
                  {errors.fuelType.message}
                </p>
              )}
            </div>

            {/* TRANSMISSIONS */}
            <div className="space-y-2">
              <Label htmlFor="transmission">Transmission</Label>

              <Select
                defaultValue={getValues("transmission")}
                onValueChange={(value) => setValue("transmission", value)}
              >
                <SelectTrigger
                  className={`${
                    errors.transmission ? "border-red-500" : ""
                  } w-full`}
                >
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  {transmissions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.transmission && (
                <p className="text-xs text-red-500">
                  {errors.transmission.message}
                </p>
              )}
            </div>

            {/* BODY TYPE */}
            <div className="space-y-2">
              <Label htmlFor="bikeType">Bike Type</Label>

              <Select
                defaultValue={getValues("bikeType")}
                onValueChange={(value) => setValue("bikeType", value)}
              >
                <SelectTrigger
                  className={`${
                    errors.bikeType ? "border-red-500" : ""
                  } w-full`}
                >
                  <SelectValue placeholder="Select bike type" />
                </SelectTrigger>
                <SelectContent>
                  {bikeTypesVal.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.bikeType && (
                <p className="text-xs text-red-500">
                  {errors.bikeType.message}
                </p>
              )}
            </div>

            {/* SEATS */}
            <div className="space-y-2">
              <Label htmlFor="seats">
                Number of Seats{" "}
                <span className="text-sm text-gray-500">(Optional)</span>
              </Label>
              <Input id="seats" {...register("seats")} placeholder="e.g. 2" />
            </div>

            {/* STATUS */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>

              <Select
                defaultValue={getValues("status")}
                onValueChange={(value) => setValue("status", value)}
              >
                <SelectTrigger className={"w-full"}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {rideStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter detailed description of the ride..."
              className={`min-h-32 ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* FEATURED */}
          <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
            <Checkbox
              id="featured"
              checked={watch("featured")}
              onCheckedChange={(checked) => {
                setValue("featured", checked);
              }}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="featured">Feature this Ride</Label>
              <p className="text-sm text-gray-500">
                Featured rides will appear on the homepage
              </p>
            </div>
          </div>

          <div>
            <Label
              htmlFor="images"
              className={imageError ? "text-red-500" : ""}
            >
              Upload Images
              {imageError && <span className="text-red-500">*</span>}
            </Label>
            <div
              {...getMultiImageRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 mt-2 text-center cursor-pointer hover:bg-gray-50 transition ${
                imageError ? "border-red-500" : "border-gray-300"
              }`}
            >
              <input {...getMultiImageInputProps()} />
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-500 mb-2">
                  Drag & drop or click to upload multiple images
                </p>
                <p className="text-gray-400 text-sm">
                  Supports: JPG, PNG, WebP (max 5MB each)
                </p>
              </div>
            </div>
            {imageError && (
              <p className="text-xs text-red-500 mt-1">{imageError}</p>
            )}
          </div>
          {uploadedImages.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">
                Uploaded Images ({uploadedImages.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={image}
                      alt={`Ride image ${index + 1}`}
                      height={50}
                      width={50}
                      className="h-28 w-full object-cover rounded-md"
                      priority
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            type="submit"
            className={"w-full md:w-auto"}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding
                rides...
              </>
            ) : (
              "Add Ride"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualEntryForm;
