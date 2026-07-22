"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMeetings, deleteMeeting } from "@/services/meetingService";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/layout/StatCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import { PageLoader } from "@/components/ui/Spinner";
import Table, {
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { notify } from "@/lib/notify";
import { Plus, Calendar, MapPin } from "lucide-react";

export default function AdminMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, []);

  useEffect(() => {
    const filtered = meetings.filter(
      (meeting) =>
        meeting.title?.toLowerCase().includes(search.toLowerCase()) ||
        meeting.location?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredMeetings(filtered);
  }, [search, meetings]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const data = await getMeetings();
      setMeetings(data.meetings || []);
      setFilteredMeetings(data.meetings || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteMeeting(deleteId);
      setMeetings((prev) => prev.filter((item) => item._id !== deleteId));
      setFilteredMeetings((prev) => prev.filter((item) => item._id !== deleteId));
      notify.success("Meeting deleted successfully");
      setDeleteId(null);
    } catch (error) {
      notify.error("Failed to delete meeting");
    } finally {
      setDeleting(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingMeetings = meetings.filter((meeting) => {
    const meetingDate = new Date(meeting.meetingDate);
    meetingDate.setHours(0, 0, 0, 0);
    return meetingDate.getTime() > today.getTime();
  }).length;

  const completedMeetings = meetings.filter((meeting) => {
    const meetingDate = new Date(meeting.meetingDate);
    meetingDate.setHours(0, 0, 0, 0);
    return meetingDate.getTime() <= today.getTime();
  }).length;

  const locations = new Set(meetings.map((m) => m.location)).size;

  if (loading) return <PageLoader message="Loading meetings..." />;

  return (
    <PageContainer>
      <PageHeader
        title="Meetings Management"
        subtitle="Manage all BNI meetings from one place"
        action={
          <Link href="/admin/meetings/create">
            <Button><Plus className="h-4 w-4" />Create Meeting</Button>
          </Link>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Meetings" value={meetings.length} icon={Calendar} color="blue" />
        <StatCard title="Upcoming" value={upcomingMeetings} icon={Calendar} color="green" />
        <StatCard title="Completed" value={completedMeetings} icon={Calendar} color="purple" />
        <StatCard title="Locations" value={locations} icon={MapPin} color="indigo" />
      </div>

      <Card className="mb-6">
        <Input
          placeholder="Search meeting title or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      <Card padding={false}>
        {filteredMeetings.length === 0 ? (
          <EmptyState
            title="No meetings found"
            description="Create your first meeting to get started."
            icon={Calendar}
            action={
              <Link href="/admin/meetings/create">
                <Button>Create Meeting</Button>
              </Link>
            }
          />
        ) : (
          <Table>
            <TableHead>
              <TableHeader>Title</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Location</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableHead>
            <TableBody>
              {filteredMeetings.map((meeting) => {
                const meetingDate = new Date(meeting.meetingDate);
                meetingDate.setHours(0, 0, 0, 0);
                const isUpcoming = meetingDate.getTime() > today.getTime();

                return (
                  <TableRow key={meeting._id}>
                    <TableCell className="font-semibold text-slate-800">{meeting.title}</TableCell>
                    <TableCell>
                      {meeting.meetingDate
                        ? new Date(meeting.meetingDate).toLocaleDateString("en-IN")
                        : "N/A"}
                    </TableCell>
                    <TableCell>{meeting.location}</TableCell>
                    <TableCell>
                      <Badge variant={isUpcoming ? "success" : "default"}>
                        {isUpcoming ? "Upcoming" : "Completed"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/admin/meetings/${meeting._id}`}>
                          <Button size="sm">View</Button>
                        </Link>
                        <Link href={`/admin/meetings/edit/${meeting._id}`}>
                          <Button size="sm" variant="warning">Edit</Button>
                        </Link>
                        <Button size="sm" variant="danger" onClick={() => setDeleteId(meeting._id)}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Meeting"
        onConfirm={handleDelete}
        loading={deleting}
        confirmLabel="Delete"
      >
        Are you sure you want to delete this meeting?
      </Modal>
    </PageContainer>
  );
}
