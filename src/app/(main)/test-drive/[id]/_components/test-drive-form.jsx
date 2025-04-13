"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { testDriveSchema } from "@/lib/zodTestDriveSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bike,
  MapPin,
  Phone,
  Mail,
  CalendarIcon,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { bookTestDrive } from "@/actions/test-drive";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TestDriveForm = ({ ride, testDriveInfo }) => {
  const router = useRouter();
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // INITIAL REACT HOOK FORM WITH ZOD RESOLVER
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(testDriveSchema),
    defaultValues: {
      date: undefined,
      timeSlot: undefined,
      notes: "",
    },
  });

  // WATCH DATE FIELD TO UPDATE AVAILABLE TIME SLOTS
  const selectedDate = watch("date");

  // GET DEALERSHIP AND BOOKING INFORMATION
  const dealership = testDriveInfo?.dealership;
  const existingBookings = testDriveInfo?.existingBookings || [];

  // CALL TEST DRIVE BOOKING SERVER ACTION
  const {
    loading: bookingInProgress,
    fn: bookTestDriveFn,
    data: bookingResult,
    error: bookingError,
  } = useFetch(bookTestDrive);

  // HANDLE BOOKING IF SUCCESS
  useEffect(() => {
    if (bookingResult?.success) {
      setBookingDetails({
        date: format(bookingResult?.data?.bookingDate, "EEEE, MMMM d, yyyy"),
        timeSlot: `${format(
          parseISO(`2022-01-01T${bookingResult?.data?.startTime}`),
          "h:mm a"
        )} - ${format(
          parseISO(`2022-01-01T${bookingResult?.data?.endTime}`),
          "h:mm a"
        )}`,
        notes: bookingResult?.data?.notes,
      });
      setShowConfirmation(true);

      // RESET FORM FIELDS
      reset();
    }
  }, [bookingResult, reset]);

  // HANDLE BOOKING IF ERROR
  useEffect(() => {
    if (bookingError) {
      toast.error(
        bookingError.message || "Failed to book test drive. Please try again."
      );
    }
  }, [bookingError]);

  // UPDATE AVAILABLE TIME SLOTS WHEN DATE CHANGES
  useEffect(() => {
    if (!selectedDate || !dealership?.workingHours) return;

    const selectedDayOfWeek = format(selectedDate, "EEEE").toUpperCase();

    // FIND WORKING HOURS FOR THE SELECTED DAY
    const daySchedule = dealership?.workingHours?.find(
      (schedule) => schedule.dayOfWeek === selectedDayOfWeek
    );

    if (!daySchedule || !daySchedule.isOpen) {
      setAvailableTimeSlots([]);
      return;
    }

    // PARSING OPENING AND CLOSING HOURS
    const openHour = parseInt(daySchedule.openTime.split(":")[0]);
    const closeHour = parseInt(daySchedule.closeTime.split(":")[0]);

    // GENERATE TIME SLOT EVERY HOURS
    const slots = [];

    for (let hour = openHour; hour < closeHour; hour++) {
      const startTime = `${hour.toString().padStart(2, "0")}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;

      // CHECK IF THIS SLOT IS ALREADY BOOKED
      const isBooked = existingBookings.some((booking) => {
        const bookingDate = booking.date;
        return (
          bookingDate === format(selectedDate, "yyyy-MM-dd") &&
          (booking.startTime === startTime || booking.endTime === endTime)
        );
      });

      if (!isBooked) {
        slots.push({
          id: `${startTime}-${endTime}`,
          label: `${startTime} - ${endTime}`,
          startTime,
          endTime,
        });
      }
    }

    setAvailableTimeSlots(slots);
    setValue("timeSlot", "");
  }, [selectedDate]);

  // DISABLE PREVIOUS DATE BEFORE TODAY
  const isDayDisabled = (day) => {
    // DISABLE PAST DATES
    if (day < new Date()) {
      return true;
    }

    // GET DAY OF WEEK
    const dayOfWeek = format(day, "EEEE").toUpperCase();

    // FIND WORKING HOURS FOR THE DAY
    const daySchedule = dealership?.workingHours?.find(
      (schedule) => schedule.dayOfWeek === dayOfWeek
    );

    // DISABLE IF DEALERSHIP IS CLOSED ON THIS DAY
    return !daySchedule || !daySchedule.isOpen;
  };

  // HANDLE SUBMIT
  const onSubmit = async (data) => {
    const selectedSlot = availableTimeSlots.find(
      (slot) => slot.id === data.timeSlot
    );

    if (!selectedSlot) {
      toast.error("Selected time slot is not available");
      return;
    }

    await bookTestDriveFn({
      rideId: ride.id,
      bookingDate: format(data.date, "yyyy-MM-dd"),
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      notes: data.notes || "",
    });
  };

  // CLOSE CONFIRMATION HANDLER
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    router.push(`/rides/${ride.id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
      {/* Ride Details */}
      <div className="md:col-span-1 space-y-6">
        <Card className="shadow-xl rounded-2xl border-none">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Ride Details
            </h2>

            <div className="aspect-video rounded-xl overflow-hidden relative mb-4 shadow-md">
              {ride.images?.length > 0 ? (
                <img
                  src={ride.images[0]}
                  alt={`${ride.year} ${ride.make} ${ride.model}`}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Bike className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-800">
              {ride.year} {ride.make} {ride.model}
            </h3>

            <div className="mt-2 text-2xl font-extrabold text-teal-600">
              ₹{ride.price.toLocaleString()}
            </div>

            <div className="mt-4 text-sm text-gray-600 space-y-2">
              {[
                ["Mileage", `${ride.mileage.toLocaleString()} kmpl`],
                ["Fuel Type", ride.fuelType],
                ["Transmission", ride.transmission],
                ["Type", ride.bikeType],
                ["Color", ride.color],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between py-1 border-b last:border-b-0"
                >
                  <span>{label}</span>
                  <span className="font-medium text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dealership Info */}
        <Card className="shadow-xl rounded-2xl border-none">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Dealership Info
            </h2>
            <div className="text-sm text-gray-700 space-y-3">
              <p className="font-semibold text-lg">
                {dealership?.name || "NextRide Motors Pvt Limited"}
              </p>
              <p className="flex items-start gap-2 text-gray-600">
                <MapPin className="w-4 h-4 mt-[2px]" />
                {dealership?.address || "Address not available"}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                {dealership?.phone || "Not available"}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                {dealership?.email || "Not available"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* BOOKING FORM */}
      <div className="md:col-span-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-6">Schedule Your Test Drive</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* DATE SELECTION */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Choose Your Preferred Date
                </label>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal hover:bg-teal-500",
                              !field.value ? "text-muted-foreground" : ""
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? format(field.value, "PPP")
                              : "Select a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={isDayDisabled}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.date && (
                        <p className="text-sm font-medium text-red-500 mt-1">
                          {errors.date.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* TIME SLOT SELECTION */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Select a Time Slot
                </label>
                <Controller
                  name="timeSlot"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={
                          !selectedDate || availableTimeSlots.length === 0
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              !selectedDate
                                ? "Select a date to view available slots"
                                : availableTimeSlots.length === 0
                                ? "No slots available for selected date"
                                : "Choose a time slot"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTimeSlots.map((slot) => (
                            <SelectItem key={slot.id} value={slot.id}>
                              {slot.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.timeSlot && (
                        <p className="text-sm font-medium text-red-500 mt-1">
                          {errors.timeSlot.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* ADDITIONAL INFO FIELD */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Additional Notes{" "}
                  <span className="text-gray-500 text-xs">(optional)</span>
                </label>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="Let us know if you have any preferences or questions about your test drive."
                      className="min-h-24 placeholder:text-gray-400/70"
                    />
                  )}
                />
              </div>

              {/* SUBMIT BUTTON */}
              <Button
                type="submit"
                className="w-full"
                disabled={bookingInProgress}
              >
                {bookingInProgress ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking Your Test Drive...
                  </>
                ) : (
                  "Book Your Test Drive"
                )}
              </Button>
            </form>

            {/* Instructions */}
            <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Here’s What You Can Expect
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  Please bring a valid driver’s license for verification
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  Enjoy a 30–60 minute drive to experience the vehicle firsthand
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  One of our representatives will be there to assist you
                  throughout the test drive
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CONFIRMATION DIALOG */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Test Drive Booked Successfully
            </DialogTitle>
            <DialogDescription>
              Your test drive has been confirmed with the following details:
            </DialogDescription>
          </DialogHeader>

          {bookingDetails && (
            <div className="py-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Ride:</span>
                  <span>
                    {ride.year} {ride.make} {ride.model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>{bookingDetails.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Time Slot:</span>
                  <span>{bookingDetails.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Dealership:</span>
                  <span>{dealership?.name || "Vehiql Motors"}</span>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 p-3 rounded text-sm text-teal-700">
                Please arrive 10 minutes early with your driver's license.
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleCloseConfirmation}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestDriveForm;
