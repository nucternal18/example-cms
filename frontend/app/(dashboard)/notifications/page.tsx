"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNotifications, useDeleteNotification, useSendNotification } from "@/lib/hooks/use-notifications";
import { Plus, Trash2, Send } from "lucide-react";

export default function NotificationsPage() {
  const { data, isLoading } = useNotifications();
  const deleteNotification = useDeleteNotification();
  const sendNotification = useSendNotification();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this notification?")) {
      await deleteNotification.mutateAsync(id);
    }
  };

  const handleSend = async (id: string) => {
    if (confirm("Are you sure you want to send this notification?")) {
      await sendNotification.mutateAsync(id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Manage push notifications</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Notification
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">{notification.title}</TableCell>
                  <TableCell>{notification.type}</TableCell>
                  <TableCell>{notification.status}</TableCell>
                  <TableCell>
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {notification.status === "PENDING" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSend(notification.id)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No notifications found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
