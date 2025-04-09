import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { processRideImageWithAI } from "@/actions/rides";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";

const AiUploadForm = ({ setUploadedImages, setActiveTab, setValue }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedAiImage, setUploadedAiImage] = useState(null);

  // IMAGE UPLOAD LOGIC
  const onAiImageDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(`Image size should be less than 5MB.`);
      return;
    }

    setUploadedAiImage(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };

    reader.readAsDataURL(file);
  };

  const { getRootProps: getAiRootProps, getInputProps: getAiInputProps } =
    useDropzone({
      onDrop: onAiImageDrop,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png", ".webp"],
      },
      maxFiles: 1,
      multiple: false,
    });

  // CALL CUSTOM HOOK TO ADD CAR IN DATABASE
  const {
    loading: processImageLoading,
    fn: processImageFn,
    data: processImageResult,
    error: processImageError,
  } = useFetch(processRideImageWithAI);

  // PROCESS WITH AI
  const processWithAI = async () => {
    if (!uploadedAiImage) {
      toast.error("Please upload an image first.");
      return;
    }

    await processImageFn(uploadedAiImage);
  };

  // HANDLE ERROR IMAGE WITH AI
  useEffect(() => {
    if (processImageError) {
      toast.error(processImageError.message || "Failed to upload car");
    }
  }, [processImageError]);

  // HANDLE SUCCESS WITH AI
  useEffect(() => {
    const rideDetails = processImageResult?.data;

    if (processImageResult?.success) {
      // UPDATE FORM WITH AI RESULT
      setValue("make", rideDetails.make);
      setValue("model", rideDetails.model);
      setValue("year", rideDetails.year.toString());
      setValue("color", rideDetails.color);
      setValue("bikeType", rideDetails.bikeType);
      setValue("fuelType", rideDetails.fuelType);
      setValue("price", rideDetails.price);
      setValue("mileage", rideDetails.mileage);
      setValue("transmission", rideDetails.transmission);
      setValue("description", rideDetails.description);

      // ADD THE IMAGE TO THE UPLOADED IMAGES
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImages((prev) => [...prev, e.target.result]);
      };

      reader.readAsDataURL(uploadedAiImage);

      toast.success("Successfully extracted car details", {
        description: `Detected ${rideDetails.year} ${rideDetails.make} ${
          rideDetails.model
        } with ${Math.round(rideDetails.confidence * 100)}% confidence`,
      });

      // Switch to manual tab for the user to review and fill in missing details
      setActiveTab("manual");
    }
  }, [processImageResult, setValue, uploadedAiImage]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Details Extraction</CardTitle>
        <CardDescription>
          Upload an image of a bike, scooter or EV and let Gemini AI extract its
          details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            {imagePreview ? (
              <div className="flex flex-col items-center">
                <img
                  src={imagePreview}
                  alt="Car preview"
                  className="max-h-56 max-w-full object-contain mb-4"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className={"hover:bg-teal-500"}
                    size="sm"
                    onClick={() => {
                      setImagePreview(null);
                      setUploadedAiImage(null);
                    }}
                  >
                    Remove
                  </Button>
                  <Button
                    onClick={processWithAI}
                    disabled={processImageLoading}
                    size="sm"
                  >
                    {processImageLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        Extract Details
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div
                {...getAiRootProps()}
                className="cursor-pointer hover:bg-gray-50 transition p-2"
              >
                <input {...getAiInputProps()} />
                <div className="flex flex-col items-center justify-center">
                  <Camera className="h-12 w-12 text-gray-400 mb-3" />
                  <span className="text-sm text-gray-600">
                    Drag & drop or click to upload a ride image
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    (JPG, PNG, WebP, max 5MB)
                  </span>
                </div>
              </div>
            )}
          </div>

          {processImageLoading && (
            <div className="bg-teal-50 text-teal-700 p-4 rounded-md flex items-center">
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">Analyzing image...</p>
                <p className="text-sm">Gemini AI is extracting details</p>
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">How it works</h3>
            <ol className="space-y-2 text-sm text-gray-600 list-decimal pl-4">
              <li>Upload a clear image of the bike or scooter</li>
              <li>Click "Extract Details" to analyze with Gemini AI</li>
              <li>Review the extracted information</li>
              <li>Fill in any missing details manually</li>
              <li>Add the bike to your inventory</li>
            </ol>
          </div>

          <div className="bg-amber-50 p-4 rounded-md">
            <h3 className="font-medium text-amber-800 mb-1">
              Tips for best results
            </h3>
            <ul className="space-y-1 text-sm text-amber-700">
              <li>• Use clear, well-lit images of the bike or scooter</li>
              <li>• Try to capture the entire vehicle from the side</li>
              <li>• For better accuracy, upload multiple angles</li>
              <li>
                • Always verify AI-extracted information before submission
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiUploadForm;
