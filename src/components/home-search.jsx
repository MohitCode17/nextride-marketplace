"use client";

import { Camera, Search, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { processImageSearch } from "@/actions/home";

const HomeSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchImage, setSearchImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isImageSearchActive, setIsImageSearchActive] = useState(false);

  const router = useRouter();

  const {
    loading: isProcessing,
    fn: processImageFn,
    data: processResult,
    error: processError,
  } = useFetch(processImageSearch);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setIsUploading(true);
      setSearchImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsUploading(false);
        toast.success("Image uploaded successfully");
      };
      reader.onerror = () => {
        setIsUploading(false);
        toast.error("Failed to read the image");
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png"],
      },
      maxFiles: 1,
    });

  const handleTextSearch = (e) => {
    e.preventDefault();

    if (!searchTerm) {
      toast.error("Please enter a search term");
      return;
    }

    router.push(`/rides?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleImageSearch = async (e) => {
    e.preventDefault();
    if (!searchImage) {
      toast.error("Please upload an image first");
      return;
    }

    // ADD THE AI LOGIC
    await processImageFn(searchImage);
  };

  // HANDLE AI SUCCESS RESULT
  useEffect(() => {
    if (processResult?.success) {
      const params = new URLSearchParams();

      // Add extracted params to the search
      if (processResult.data.make) params.set("make", processResult.data.make);

      if (processResult.data.bodyType)
        params.set("bodyType", processResult.data.bodyType);

      if (processResult.data.color)
        params.set("color", processResult.data.color);

      // Redirect to search results
      router.push(`/rides?${params.toString()}`);
    }
  }, [processResult, router]);

  // HANDLE ERROR AI RESPONSE
  useEffect(() => {
    if (processError) {
      toast.error(
        "Failed to analyze image: " + (processError.message || "Unknown error")
      );
    }
  }, [processError]);

  return (
    <div>
      <form onSubmit={handleTextSearch}>
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-lime-400 z-50" />
          <input
            type="text"
            placeholder="Search bikes, scooties, EVs or try our AI image search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-lime-600/50 bg-[#0c1a1a]/70 backdrop-blur-md py-5 pr-14 pl-12 text-white placeholder:text-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-lime-500 transition"
          />

          {/* CAMERA BUTTON */}
          <div className="absolute right-[100px]">
            <Camera
              size={35}
              onClick={() => setIsImageSearchActive(!isImageSearchActive)}
              className="cursor-pointer rounded-full p-2 transition"
              style={{
                background: isImageSearchActive ? "#00bfa6" : "",
                color: isImageSearchActive ? "white" : "#00bfa6",
              }}
            />
          </div>

          {/* SEARCH BUTTON */}
          <Button
            type="submit"
            className="absolute right-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white px-5 py-2"
          >
            Search
          </Button>
        </div>
      </form>

      {isImageSearchActive && (
        <div className="mt-6">
          <form onSubmit={handleImageSearch} className="space-y-4">
            <div className="border-2 border-dashed border-lime-700/50 bg-[#0c1a1a]/70 backdrop-blur-md rounded-3xl p-6 text-center text-white shadow-md transition">
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Vehicle preview"
                    className="h-40 object-contain mb-4 rounded-md"
                  />
                  <Button
                    variant="outline"
                    className={
                      "bg-red-500 border-red-500 hover:bg-red-600 transition"
                    }
                    onClick={() => {
                      setSearchImage(null);
                      setImagePreview("");
                      toast.info("Image removed");
                    }}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div {...getRootProps()} className="cursor-pointer">
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-teal-400 mb-2" />
                    <p className="text-gray-300 mb-1">
                      {isDragActive && !isDragReject
                        ? "Leave the file here to upload"
                        : "Drag & drop a bike/scooty/EV image or click to select"}
                    </p>
                    {isDragReject && (
                      <p className="text-red-500 mb-2">Invalid image type</p>
                    )}
                    <p className="text-gray-500 text-sm">
                      Supports: JPG, PNG (max 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {imagePreview && (
              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3"
                disabled={isUploading || isProcessing}
              >
                {isUploading
                  ? "Uploading..."
                  : isProcessing
                  ? "Analyzing image..."
                  : "Search with this Image"}
              </Button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default HomeSearch;
