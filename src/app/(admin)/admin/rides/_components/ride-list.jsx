"use client";

import {
  deleteCar,
  deleteRide,
  getRides,
  updateCarStatus,
  updateRideStatus,
} from "@/actions/rides";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useFetch from "@/hooks/use-fetch";
import { formatCurrency } from "@/lib/helpers";
import {
  Bike,
  BikeIcon,
  CarIcon,
  Eye,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const RideList = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rideToDelete, setRideToDelete] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Available
          </Badge>
        );
      case "UNAVAILABLE":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Unavailable
          </Badge>
        );
      case "SOLD":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Sold
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // GETTING ALL CARS FROM DB
  const {
    loading: loadingRides,
    fn: fetchRides,
    data: ridesData,
    error: ridesError,
  } = useFetch(getRides);

  // UPDATE CAR
  const {
    loading: updatingRide,
    fn: updateRideStatusFn,
    data: updateResult,
    error: updateError,
  } = useFetch(updateRideStatus);

  // DELETE CAR
  const {
    loading: deletingRide,
    fn: deleteRideFn,
    data: deleteResult,
    error: deleteError,
  } = useFetch(deleteRide);

  // INITIAL FETCH FOR GETTING CARS WHEN COMPONENT MOUNT
  useEffect(() => {
    fetchRides(search);
  }, [search]);

  // TOGGLE FEATURED STATUS
  const handleToggleFeatured = async (ride) => {
    await updateRideStatusFn(ride.id, { featured: !ride.featured });
  };

  // Handle STATUS CHANGE
  const handleStatusUpdate = async (ride, newStatus) => {
    await updateRideStatusFn(ride.id, { status: newStatus });
  };

  // Handle delete car
  const handleDeleteRide = async () => {
    if (!rideToDelete) return;

    await deleteRideFn(rideToDelete.id);
    setDeleteDialogOpen(false);
    setRideToDelete(null);
  };

  // HANDLE SUCCESSFULL
  useEffect(() => {
    if (deleteResult?.success) {
      toast.success("Ride deleted successfully");
      fetchRides(search);
    }

    if (updateResult?.success) {
      toast.success("Ride updated successfully");
      fetchRides(search);
    }
  }, [updateResult, deleteResult, search]);

  // HANDLE ERRORS
  useEffect(() => {
    if (ridesError) {
      toast.error("Failed to load rides");
    }

    if (deleteError) {
      toast.error("Failed to delete ride");
    }

    if (updateError) {
      toast.error("Failed to update ride");
    }
  }, [ridesError, deleteError, updateError]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    fetchRides(search);
  };

  return (
    <div className="space-y-4">
      {/* HEADER + SEARCH */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-end">
        <Button
          onClick={() => router.push("/admin/rides/create")}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Rides
        </Button>
        <form onSubmit={handleSearchSubmit} className="w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              className="pl-9 w-full sm:w-60 bg-accent-foreground"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rides..."
            />
          </div>
        </form>
      </div>

      {/* CARS TABLE */}
      <Card>
        <CardContent className="p-0">
          {loadingRides && !ridesData ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : ridesData?.success && ridesData.data.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Make & Model</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ridesData.data.map((ride) => (
                    <TableRow key={ride.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="w-16 h-12 rounded-md overflow-hidden">
                          {ride.images && ride.images.length > 0 ? (
                            <Image
                              src={ride.images[0]}
                              alt={`${ride.make} ${ride.model}`}
                              height={40}
                              width={40}
                              className="w-full h-full object-contain"
                              priority
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Bike className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium truncate max-w-[180px]">
                        {ride.make} {ride.model}
                      </TableCell>
                      <TableCell>{ride.year}</TableCell>
                      <TableCell>{formatCurrency(ride.price)}</TableCell>
                      <TableCell>{getStatusBadge(ride.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-9 w-9 hover:bg-accent-foreground"
                          onClick={() => handleToggleFeatured(ride)}
                          disabled={updatingRide}
                        >
                          {ride.featured ? (
                            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                          ) : (
                            <StarOff className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-8 w-8 hover:bg-lime-500"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              className={"hover:bg-lime-400 focus:bg-lime-400"}
                              onClick={() => router.push(`/rides/${ride.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Status</DropdownMenuLabel>
                            <DropdownMenuItem
                              className={"hover:bg-lime-400 focus:bg-lime-400"}
                              onClick={() =>
                                handleStatusUpdate(ride, "AVAILABLE")
                              }
                              disabled={
                                ride.status === "AVAILABLE" || updatingRide
                              }
                            >
                              Set Available
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={"hover:bg-lime-400 focus:bg-lime-400"}
                              onClick={() =>
                                handleStatusUpdate(ride, "UNAVAILABLE")
                              }
                              disabled={
                                ride.status === "UNAVAILABLE" || updatingRide
                              }
                            >
                              Set Unavailable
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={"hover:bg-lime-400 focus:bg-lime-400"}
                              onClick={() => handleStatusUpdate(ride, "SOLD")}
                              disabled={ride.status === "SOLD" || updatingRide}
                            >
                              Mark as Sold
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 hover:bg-lime-400 focus:bg-lime-400"
                              onClick={() => {
                                setRideToDelete(ride);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <BikeIcon className="h-14 w-14 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No rides found
              </h3>
              <p className="text-gray-500 mb-4">
                {search
                  ? "No rides match your search criteria"
                  : "Your inventory is empty. Add rides to get started."}
              </p>
              <Button onClick={() => router.push("/admin/rides/create")}>
                Add Your First Ride
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {rideToDelete?.make} {rideToDelete?.model}
              </span>{" "}
              ({rideToDelete?.year})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deletingRide}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteRide}
              disabled={deletingRide}
            >
              {deletingRide ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Ride"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RideList;
