import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Shield } from "lucide-react";
import React from "react";

const SettingsForm = () => {
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
        <TabsContent value="hours">
          <div>Working Hours</div>
        </TabsContent>

        {/* TAB CONTENT - ADMINS */}
        <TabsContent value="admins">
          <div>Admin Users</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsForm;
