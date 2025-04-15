import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";

const DashboardTestDriveTab = ({ testDrives }) => {
  return (
    <TabsContent
      value="test-drives"
      className={"space-y-8 pt-6 animate-in fade-in duration-300"}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="overflow-hidden rounded-2xl border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Bookings
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {testDrives.total}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-2xl border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Pending
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {testDrives.pending}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-amber-500 font-medium">
                {((testDrives.pending / testDrives.total) * 100).toFixed(1)}%
              </span>{" "}
              of bookings
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-2xl border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Confirmed
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {testDrives.confirmed}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-emerald-500 font-medium">
                {((testDrives.confirmed / testDrives.total) * 100).toFixed(1)}%
              </span>{" "}
              of bookings
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-2xl border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Completed
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {testDrives.completed}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-blue-500 font-medium">
                {((testDrives.completed / testDrives.total) * 100).toFixed(1)}%
              </span>{" "}
              of bookings
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-2xl border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Cancelled
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {testDrives.cancelled}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-red-500 font-medium">
                {((testDrives.cancelled / testDrives.total) * 100).toFixed(1)}%
              </span>{" "}
              of bookings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* TEST DRIVES STATUS VISUALIZATION */}
      <Card className="overflow-hidden rounded-2xl border-none shadow-lg bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="border-b border-slate-100 pb-6">
          <CardTitle className="text-xl font-semibold text-slate-800">
            Test Drive Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-teal-50 to-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-medium text-slate-700 mb-2">
                Conversion Rate
              </h3>
              <div className="text-4xl font-bold text-teal-600">
                {testDrives.conversionRate}%
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Test drives resulting in car purchases
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-medium text-slate-700 mb-2">
                Completion Rate
              </h3>
              <div className="text-4xl font-bold text-emerald-600">
                {testDrives.total
                  ? ((testDrives.completed / testDrives.total) * 100).toFixed(1)
                  : 0}
                %
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Test drives successfully completed
              </p>
            </div>
          </div>

          <div className="space-y-6 mt-8 p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-sm">
            <h3 className="font-medium text-lg text-slate-700 mb-4">
              Booking Status Breakdown
            </h3>

            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">Pending</span>
                  <span className="font-semibold text-amber-600">
                    {testDrives.pending} (
                    {((testDrives.pending / testDrives.total) * 100).toFixed(1)}
                    %)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-amber-600 h-3 rounded-full transition-all duration-500 ease-in-out"
                    style={{
                      width: `${
                        (testDrives.pending / testDrives.total) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">Confirmed</span>
                  <span className="font-semibold text-emerald-600">
                    {testDrives.confirmed} (
                    {((testDrives.confirmed / testDrives.total) * 100).toFixed(
                      1
                    )}
                    %)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3 rounded-full transition-all duration-500 ease-in-out"
                    style={{
                      width: `${
                        (testDrives.confirmed / testDrives.total) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">Completed</span>
                  <span className="font-semibold text-blue-600">
                    {testDrives.completed} (
                    {((testDrives.completed / testDrives.total) * 100).toFixed(
                      1
                    )}
                    %)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500 ease-in-out"
                    style={{
                      width: `${
                        (testDrives.completed / testDrives.total) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">Cancelled</span>
                  <span className="font-semibold text-red-600">
                    {testDrives.cancelled} (
                    {((testDrives.cancelled / testDrives.total) * 100).toFixed(
                      1
                    )}
                    %)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full transition-all duration-500 ease-in-out"
                    style={{
                      width: `${
                        (testDrives.cancelled / testDrives.total) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">No Show</span>
                  <span className="font-semibold text-slate-600">
                    {testDrives.noShow} (
                    {((testDrives.noShow / testDrives.total) * 100).toFixed(1)}
                    %)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-slate-400 to-slate-600 h-3 rounded-full transition-all duration-500 ease-in-out"
                    style={{
                      width: `${(testDrives.noShow / testDrives.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default DashboardTestDriveTab;
