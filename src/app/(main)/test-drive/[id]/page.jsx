import { getRideById } from "@/actions/ride-listing";
import { notFound } from "next/navigation";
import React from "react";
import TestDriveForm from "./_components/test-drive-form";

export async function generateMetadata() {
  return {
    title: `Book Test Drive | NextRide`,
    description: `Schedule a test drive in few seconds`,
  };
}

export default async function TestDrivePage({ params }) {
  // FETCH RIDE DETAILS
  const id = params.id;
  const result = await getRideById(id);

  // NOT FOUND
  if (!result.success) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold md:w-xl mb-4">
        Ready for Your Next Adventure? Book a Test Drive Today!
      </h1>
      <TestDriveForm
        ride={result.data}
        testDriveInfo={result.data.testDriveInfo}
      />
    </div>
  );
}
