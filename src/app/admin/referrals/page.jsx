"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { apiRoot } from "@/services/api";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { PageLoader } from "@/components/ui/Spinner";
import Table, {
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { Handshake } from "lucide-react";

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${apiRoot}/referrals/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReferrals(res.data.referrals || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statusVariant = (status) => {
    if (status === "Approved") return "success";
    if (status === "Rejected") return "danger";
    return "pending";
  };

  if (loading) return <PageLoader message="Loading referrals..." />;

  return (
    <PageContainer>
      <PageHeader
        title="All Referrals"
        subtitle={`${referrals.length} total referrals`}
      />

      <Card padding={false}>
        {referrals.length === 0 ? (
          <EmptyState title="No referrals found" icon={Handshake} />
        ) : (
          <Table>
            <TableHead>
              <TableHeader>Client Name</TableHeader>
              <TableHeader>Mobile</TableHeader>
              <TableHeader>To Member</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader className="text-center">Action</TableHeader>
            </TableHead>
            <TableBody>
              {referrals.map((referral) => (
                <TableRow key={referral._id}>
                  <TableCell className="font-medium text-slate-800">{referral.clientName}</TableCell>
                  <TableCell>{referral.clientMobile}</TableCell>
                  <TableCell>{referral.toMember?.name || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(referral.status)}>{referral.status}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/admin/referrals/${referral._id}`}>
                      <Button size="sm">View</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </PageContainer>
  );
}
