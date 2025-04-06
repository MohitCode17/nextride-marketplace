"use client";

import { getDealerShipInfo, saveWorkingHours } from "@/actions/setting";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useFetch from "@/hooks/use-fetch";
import { DAYS } from "@/lib/data";
import { Clock, Loader2, Save, Shield } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const SettingsForm = () => {
  const [workingHours, setWorkingHours] = useState(
    DAYS.map((day) => ({
      dayOfWeek: day.value,
      openTime: "09:00",
      closeTime: "18:00",
      isOpen: day.value !== "SUNDAY",
    }))
  );

  // FETCHING INTIAL WORKING HOURS
  const {
    fn: fetchDealershipInfo,
    data: settingsData,
    error: settingsError,
  } = useFetch(getDealerShipInfo);

  // FETCH UPDATING WORKING HOURS
  const {
    loading: savingHours,
    fn: saveHours,
    data: saveResult,
    error: saveError,
  } = useFetch(saveWorkingHours);

  // FETCH DEALERSHIP INFO
  useEffect(() => {
    fetchDealershipInfo();
  }, []);

  // HANDLE ERRORS
  useEffect(() => {
    if (settingsError) {
      toast.error("Failed to load dealership settings");
    }

    if (saveError) {
      toast.error(`Failed to save working hours: ${saveError.message}`);
    }
  }, [settingsError, saveError]);

  // HANDLE SUCCESS
  useEffect(() => {
    if (saveResult?.success) {
      toast.success("Working hours saved successfully");
      fetchDealershipInfo();
    }
  }, [saveResult]);

  // UPDATE WORKING HOURS WHEN DEALERSHIP INFO CHANGES
  useEffect(() => {
    if (settingsData?.data?.workingHours) {
      setWorkingHours(settingsData.data.workingHours);
    }
  }, [settingsData]);

  // HANDLE INPUT CHANGES
  const handleWorkingHourChange = (index, field, value) => {
    const updatedHours = [...workingHours];
    updatedHours[index] = {
      ...updatedHours[index],
      [field]: value,
    };

    setWorkingHours(updatedHours);
  };

  // SAVE WORKING HOURS
  const handleSaveHours = async () => {
    await saveHours(workingHours);
  };

  return (
    <div>
      <Tabs defaultValue="hours">
        <TabsList>
          <TabsTrigger value="hours">
            <Clock className="h-4 w-4 mr-2" />
            Working Hours
          </TabsTrigger>
          <TabsTrigger value="admins">
            <Shield className="h-4 w-4 mr-2" />
            Admin Users
          </TabsTrigger>
        </TabsList>
        {/* TAB CONTENT - HOURS */}
        <TabsContent value="hours" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Working Hours</CardTitle>
              <CardDescription>
                Set your dealership's working hours for each day of the week.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                {DAYS.map((day, index) => (
                  <div
                    key={day.value}
                    className="grid grid-cols-12 gap-4 items-center py-3 px-4 rounded-lg hover:bg-slate-50"
                  >
                    <div className="col-span-3 md:col-span-2">
                      <div className="font-medium">{day.label}</div>
                    </div>

                    <div className="col-span-9 md:col-span-2 flex items-center">
                      <Checkbox
                        id={`is-open-${day.value}`}
                        checked={workingHours[index]?.isOpen}
                        onCheckedChange={(checked) => {
                          handleWorkingHourChange(index, "isOpen", checked);
                        }}
                      />
                      <Label
                        htmlFor={`is-open-${day.value}`}
                        className="ml-2 cursor-pointer"
                      >
                        {workingHours[index]?.isOpen ? "Open" : "Closed"}
                      </Label>
                    </div>

                    {workingHours[index]?.isOpen && (
                      <>
                        <div className="col-span-5 md:col-span-4">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            <Input
                              type="time"
                              value={workingHours[index]?.openTime}
                              onChange={(e) =>
                                handleWorkingHourChange(
                                  index,
                                  "openTime",
                                  e.target.value
                                )
                              }
                              className="text-sm"
                            />
                          </div>
                        </div>

                        <div className="text-center col-span-1">to</div>

                        <div className="col-span-5 md:col-span-3">
                          <Input
                            type="time"
                            value={workingHours[index]?.closeTime}
                            onChange={(e) =>
                              handleWorkingHourChange(
                                index,
                                "closeTime",
                                e.target.value
                              )
                            }
                            className="text-sm"
                          />
                        </div>
                      </>
                    )}

                    {!workingHours[index]?.isOpen && (
                      <div className="col-span-11 md:col-span-8 text-gray-500 italic text-sm">
                        Closed all day
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveHours} disabled={savingHours}>
                  {savingHours ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Working Hours
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB CONTENT - ADMINS */}
        <TabsContent value="admins" className="space-y-6 mt-6">
          <div>Admin Users</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsForm;
