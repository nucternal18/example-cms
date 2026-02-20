"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
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
import { useForm, useFormSubmissions } from "@/lib/hooks/use-forms";
import { ArrowLeft, Download } from "lucide-react";

export default function FormSubmissionsPage() {
  const params = useParams();
  const formId = params.id as string;
  const [page, setPage] = useState(1);
  const { data: formData } = useForm(formId);
  const { data: submissionsData, isLoading } = useFormSubmissions(formId, page, 10);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const form = formData?.data;
  const submissions = submissionsData?.data.data || [];
  const total = submissionsData?.data.total || 0;

  const exportCSV = () => {
    if (!form || !submissions.length) return;

    const headers = form.fields.map((f) => f.label).join(",");
    const rows = submissions.map((sub) =>
      form.fields
        .map((field) => {
          const value = sub.data[field.name];
          return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value;
        })
        .join(",")
    );

    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.slug}-submissions.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/forms">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {form?.title || "Form"} Submissions
          </h1>
          <p className="text-muted-foreground">
            View and manage form submissions
          </p>
        </div>
        {submissions.length > 0 && (
          <Button variant="outline" onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {total} Submission{total !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No submissions yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {form?.fields.map((field) => (
                    <TableHead key={field.name}>{field.label}</TableHead>
                  ))}
                  <TableHead>Submitted</TableHead>
                  {submissions[0]?.userEmail && <TableHead>Email</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    {form?.fields.map((field) => (
                      <TableCell key={field.name}>
                        {String(submission.data[field.name] || "-")}
                      </TableCell>
                    ))}
                    <TableCell>
                      {new Date(submission.submittedAt).toLocaleString()}
                    </TableCell>
                    {submission.userEmail && (
                      <TableCell>{submission.userEmail}</TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
