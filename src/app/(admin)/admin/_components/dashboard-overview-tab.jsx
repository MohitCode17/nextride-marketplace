import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Bike, Calendar, IndianRupee, TrendingUp } from "lucide-react";
import React from "react";

const DashboardOverViewTab = ({ rides, testDrives }) => {
  return (
    <TabsContent
      value="overview"
      className={"space-y-8 pt-6 animate-in fade-in duration-300"}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden rounded-2xl border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Rides
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
              <Bike className="h-5 w-5 text-indigo-600" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {rides.total}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-emerald-500 font-medium">
                {rides.available}
              </span>{" "}
              available,{" "}
              <span className="text-indigo-500 font-medium">{rides.sold}</span>{" "}
              sold
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-2xl border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Test Drives
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {testDrives.total}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-amber-500 font-medium">
                {testDrives.pending}
              </span>{" "}
              pending,{" "}
              <span className="text-emerald-500 font-medium">
                {testDrives.confirmed}
              </span>{" "}
              confirmed
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-2xl border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Conversion Rate
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-teal-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {testDrives.conversionRate}%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              From test drives to sales
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-2xl border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Rides Sold
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <IndianRupee className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {rides.sold}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-emerald-500 font-medium">
                {((rides.sold / rides.total) * 100).toFixed(1)}%
              </span>{" "}
              of inventory
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden rounded-2xl border-none shadow-lg bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="border-b border-slate-100 pb-6">
          <CardTitle className="text-xl font-semibold text-slate-800">
            Dealership Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl shadow-sm">
                <h3 className="font-medium text-slate-700 mb-3">
                  Ride Inventory
                </h3>
                <div className="flex items-center">
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3 rounded-full transition-all duration-500 ease-in-out"
                      style={{
                        width: `${(rides.available / rides.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm font-semibold text-slate-700">
                    {((rides.available / rides.total) * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  Available inventory capacity
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl shadow-sm">
                <h3 className="font-medium text-slate-700 mb-3">
                  Test Drive Success
                </h3>
                <div className="flex items-center">
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-teal-400 to-teal-600 h-3 rounded-full transition-all duration-500 ease-in-out"
                      style={{
                        width: `${
                          (testDrives.completed / (testDrives.total || 1)) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm font-semibold text-slate-700">
                    {(
                      (testDrives.completed / (testDrives.total || 1)) *
                      100
                    ).toFixed(0)}
                    %
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  Completed test drives
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 shadow-sm text-center">
                <span className="text-4xl font-bold text-teal-600 flex justify-center items-center">
                  {rides.sold}
                </span>
                <p className="text-sm text-slate-600 mt-2">Rides Sold</p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 shadow-sm text-center">
                <span className="text-4xl font-bold text-amber-600 flex justify-center items-center">
                  {testDrives.pending + testDrives.confirmed}
                </span>
                <p className="text-sm text-slate-600 mt-2">
                  Upcoming Test Drives
                </p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 shadow-sm text-center">
                <span className="text-4xl font-bold text-emerald-600 flex justify-center items-center">
                  {((rides.available / (rides.total || 1)) * 100).toFixed(0)}%
                </span>
                <p className="text-sm text-slate-600 mt-2">
                  Inventory Utilization
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default DashboardOverViewTab;
