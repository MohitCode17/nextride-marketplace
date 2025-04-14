import React, { useState } from "react";
import { Card } from "./ui/card";
import Image from "next/image";
import { ArrowRight, Bike, Calendar, Clock, Loader2, User } from "lucide-react";
import { format } from "date-fns";
import { Button } from "./ui/button";
import Link from "next/link";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

// HELPER FUNCTIONS
const getStatusBadge = (status) => {
  const statusMap = {
    PENDING: { text: "Pending", color: "bg-amber-100 text-amber-800" },
    CONFIRMED: { text: "Confirmed", color: "bg-green-100 text-green-800" },
    COMPLETED: { text: "Completed", color: "bg-blue-100 text-blue-800" },
    CANCELLED: { text: "Cancelled", color: "bg-gray-100 text-gray-800" },
    NO_SHOW: { text: "No Show", color: "bg-red-100 text-red-800" },
  };

  const badge = statusMap[status];
  return badge ? (
    <Badge className={badge.color}>{badge.text}</Badge>
  ) : (
    <Badge variant="outline">{status}</Badge>
  );
};

const formatTime = (timeString) => {
  try {
    return format(parseISO(`2022-01-01T${timeString}`), "h:mm a");
  } catch (error) {
    return timeString;
  }
};

const TestDriveCard = ({
  booking,
  onCancel,
  showActions = true,
  isPast = false,
  isAdmin = false,
  isCancelling = false,
  renderStatusSelector = () => null,
}) => {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // HANDLE CANCEL
  const handleCancel = async () => {
    if (!onCancel) return;

    await onCancel(booking.id);
    setCancelDialogOpen(false);
  };

  return (
    <>
      <Card
        className={`rounded-2xl overflow-hidden shadow-sm border ${
          isPast ? "opacity-75 hover:opacity-100 transition-opacity" : ""
        }`}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Ride Image */}
          <div className="sm:w-1/4 relative h-48 sm:h-auto">
            {booking.ride.images?.[0] ? (
              <Image
                src={booking.ride.images[0]}
                alt={`${booking.ride.make} ${booking.ride.model}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <Bike className="h-10 w-10 text-gray-400" />
              </div>
            )}
            <div className="absolute top-2 right-2 sm:hidden">
              {getStatusBadge(booking.status)}
            </div>
          </div>

          {/* Booking Info */}
          <div className="p-4 sm:flex-1 sm:w-2/3 flex flex-col justify-between">
            <div>
              <div className="hidden sm:block mb-3">
                {getStatusBadge(booking.status)}
              </div>

              <h3 className="text-xl font-semibold mb-1">
                {booking.ride.year} {booking.ride.make} {booking.ride.model}
              </h3>
              {renderStatusSelector()}

              <div className="space-y-2 text-sm mt-3 text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(booking.bookingDate), "EEEE, MMMM d, yyyy")}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {formatTime(booking.startTime)} –{" "}
                  {formatTime(booking.endTime)}
                </div>

                {isAdmin && booking.user && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {booking.user.name || booking.user.email}
                  </div>
                )}
              </div>
            </div>

            {booking.notes && (
              <div className="bg-gray-50 p-3 rounded-md mt-4 text-sm">
                <p className="font-medium">Notes:</p>
                <p className="text-gray-700">{booking.notes}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="p-4 sm:w-1/4 flex flex-col justify-center space-y-3 border-t sm:border-t-0 sm:border-l">
              <Button
                variant="outline"
                size="sm"
                className="w-full hover:bg-teal-500 hover:text-white"
                asChild
              >
                <Link
                  href={`/rides/${booking.rideId}`}
                  className="flex items-center justify-center"
                >
                  View Ride <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              {(booking.status === "PENDING" ||
                booking.status === "CONFIRMED") && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => setCancelDialogOpen(true)}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Cancel"
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Cancel Confirmation Dialog */}
      {onCancel && (
        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Test Drive</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your test drive for the{" "}
                {booking.ride.year} {booking.ride.make} {booking.ride.model}?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>
                  {format(new Date(booking.bookingDate), "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Time:</span>
                <span>
                  {formatTime(booking.startTime)} –{" "}
                  {formatTime(booking.endTime)}
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                className={"hover:bg-teal-500"}
                onClick={() => setCancelDialogOpen(false)}
                disabled={isCancelling}
              >
                Keep Reservation
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Cancel Reservation"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default TestDriveCard;
