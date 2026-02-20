"use client";

import { useState } from "react";
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
import { useFeedback, useUpdateFeedbackStatus, FeedbackStatus } from "@/lib/hooks/use-feedback";

export default function FeedbackPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useFeedback(undefined, page, 10);
  const updateStatus = useUpdateFeedbackStatus();

  const handleStatusChange = async (id: string, status: FeedbackStatus) => {
    await updateStatus.mutateAsync({ id, status });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feedback</h1>
          <p className="text-muted-foreground">View and manage user feedback</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.data.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell className="font-medium">{feedback.subject}</TableCell>
                  <TableCell>{feedback.type}</TableCell>
                  <TableCell>{feedback.status}</TableCell>
                  <TableCell>
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {feedback.status === FeedbackStatus.OPEN && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleStatusChange(feedback.id, FeedbackStatus.IN_PROGRESS)
                        }
                      >
                        Mark In Progress
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {(!data?.data.data || data.data.data.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No feedback found
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
