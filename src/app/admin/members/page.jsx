"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
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
import { Plus } from "lucide-react";

export default function AdminMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(res.data.data || []);
    } catch (error) {
      console.error("Members Error:", error.response?.data || error.message);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/members/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      notify.success("Member deleted successfully");
      setDeleteId(null);
      fetchMembers();
    } catch (error) {
      notify.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const filteredMembers = members.filter((member) => member.role === "member");

  if (loading) return <PageLoader message="Loading members..." />;

  return (
    <PageContainer>
      <PageHeader
        title="Members Management"
        subtitle={`Total Members: ${filteredMembers.length}`}
        action={
          <Link href="/admin/members/create">
            <Button>
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
          </Link>
        }
      />

      <Card padding={false}>
        {filteredMembers.length === 0 ? (
          <EmptyState
            title="No members found"
            description="Get started by adding your first member."
            action={
              <Link href="/admin/members/create">
                <Button>Add Member</Button>
              </Link>
            }
          />
        ) : (
          <Table>
            <TableHead>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader className="text-center">Actions</TableHeader>
            </TableHead>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={member.name} />
                      <div>
                        <p className="font-semibold text-slate-800">{member.name}</p>
                        {member.businessName && (
                          <p className="text-sm text-slate-500">{member.businessName}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Link href={`/admin/members/${member._id}`}>
                        <Button size="sm">View</Button>
                      </Link>
                      <Link href={`/admin/members/${member._id}/edit`}>
                        <Button size="sm" variant="warning">Edit</Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setDeleteId(member._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Member"
        onConfirm={handleDelete}
        loading={deleting}
        confirmLabel="Delete"
      >
        Are you sure you want to delete this member? This action cannot be undone.
      </Modal>
    </PageContainer>
  );
}
