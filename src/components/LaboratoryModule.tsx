// src/components/LaboratoryModule.tsx
import { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

import {
  FlaskConical,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Thermometer,
  Droplets,
  Beaker,
  Search,
  Download,
  Eye,
} from "lucide-react";


const GET_TESTS = gql`
  query GetTests {
    getTests {
      id
      batch_number
      sample_id
      date
      product
      ph_level
      tds_level
      chlorine
      turbidity
      conductivity
      temperature
      microbioligy_test
      chemical_test
      physical_test
      note
    }
  }
`;

const CREATE_TEST = gql`
  mutation CreateTest(
    $batch_number: String
    $sample_id: String
    $product: ID!
    $ph_level: String
    $tds_level: String
    $chlorine: String
    $turbidity: String
    $conductivity: String
    $temperature: String
    $microbioligy_test: String
    $chemical_test: String
    $physical_test: String
    $note: String
  ) {
    createTest(
      batch_number: $batch_number
      sample_id: $sample_id
      product: $product
      ph_level: $ph_level
      tds_level: $tds_level
      chlorine: $chlorine
      turbidity: $turbidity
      conductivity: $conductivity
      temperature: $temperature
      microbioligy_test: $microbioligy_test
      chemical_test: $chemical_test
      physical_test: $physical_test
      note: $note
    ) {
      id
      batch_number
      sample_id
      product
      ph_level
      tds_level
      chlorine
      turbidity
      conductivity
      temperature
      microbioligy_test
      chemical_test
      physical_test
      note
    }
  }
`;

export function LaboratoryModule() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_TESTS, {
    fetchPolicy: "network-only",
  });
  const [createTest, { loading: creating }] = useMutation(CREATE_TEST);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const variables = {
      batch_number: (fd.get("batch_number") as string) || null,
      sample_id: (fd.get("sample_id") as string) || null,
      product: (fd.get("product") as string) || null,
      ph_level: (fd.get("ph_level") as string) || null,
      tds_level: (fd.get("tds_level") as string) || null,
      chlorine: (fd.get("chlorine") as string) || null,
      turbidity: (fd.get("turbidity") as string) || null,
      conductivity: (fd.get("conductivity") as string) || null,
      temperature: (fd.get("temperature") as string) || null,
      microbioligy_test: (fd.get("microbioligy_test") as string) || null,
      chemical_test: (fd.get("chemical_test") as string) || null,
      physical_test: (fd.get("physical_test") as string) || null,
      note: (fd.get("note") as string) || null,
    };

    try {
      await createTest({ variables });
      toast.success("Test record created successfully");
      setIsDialogOpen(false);
      form.reset();
      await refetch();
    } catch (err: any) {
      console.error("Create test error:", err);
      toast.error(err?.message || "Failed to create test");
    }
  };

  if (loading) return <div className="p-6">Loading tests…</div>;
  if (error) return <div className="p-6 text-red-600">Failed to load tests.</div>;

  const tests = data?.getTests ?? [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Laboratory Management</h1>
          <p className="text-sm text-gray-600">Quality control testing</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> New Test
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Record New Test</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="batch_number">Batch Number</Label>
                    <Input id="batch_number" name="batch_number" placeholder="B2024-..." required />
                  </div>
                  <div>
                    <Label htmlFor="sample_id">Sample ID</Label>
                    <Input id="sample_id" name="sample_id" placeholder="SMP-001" required />
                  </div>
                  <div>
                    <Label htmlFor="date">Test Date</Label>
                    <Input id="date" name="date" type="date" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="product">Product</Label>
                  <Select name="product" defaultValue="">
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="500ml Water Bottle">500ml Water Bottle</SelectItem>
                      <SelectItem value="1L Water Bottle">1L Water Bottle</SelectItem>
                      <SelectItem value="1.5L Water Bottle">1.5L Water Bottle</SelectItem>
                      <SelectItem value="5L Water Bottle">5L Water Bottle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="ph_level">pH Level</Label>
                    <Input id="ph_level" name="ph_level" type="number" step="0.1" placeholder="7.2" />
                  </div>
                  <div>
                    <Label htmlFor="tds_level">TDS (ppm)</Label>
                    <Input id="tds_level" name="tds_level" type="number" step="0.1" placeholder="50" />
                  </div>
                  <div>
                    <Label htmlFor="chlorine">Chlorine (mg/L)</Label>
                    <Input id="chlorine" name="chlorine" step="0.01" placeholder="0.02" />
                  </div>
                  <div>
                    <Label htmlFor="turbidity">Turbidity (NTU)</Label>
                    <Input id="turbidity" name="turbidity" step="0.1" placeholder="0.5" />
                  </div>
                  <div>
                    <Label htmlFor="conductivity">Conductivity (μS/cm)</Label>
                    <Input id="conductivity" name="conductivity" placeholder="220" />
                  </div>
                  <div>
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <Input id="temperature" name="temperature" type="number" step="0.1" placeholder="22" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Microbiology</Label>
                    <Select name="microbioligy_test" defaultValue="pending">
                      <SelectTrigger><SelectValue placeholder="Result" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pass">Pass</SelectItem>
                        <SelectItem value="fail">Fail</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Chemical</Label>
                    <Select name="chemical_test" defaultValue="pending">
                      <SelectTrigger><SelectValue placeholder="Result" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pass">Pass</SelectItem>
                        <SelectItem value="fail">Fail</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Physical</Label>
                    <Select name="physical_test" defaultValue="pending">
                      <SelectTrigger><SelectValue placeholder="Result" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pass">Pass</SelectItem>
                        <SelectItem value="fail">Fail</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea name="note" placeholder="Observations..." />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={creating}>{creating ? "Saving..." : "Save Test Results"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tests table */}
      <Card>
        <CardHeader>
          <CardTitle>Laboratory Test Records</CardTitle>
        </CardHeader>
        <CardContent>
          {tests.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No test records found</div>
          ) : (
            <div className="overflow-x-auto " >
              <table className="min-w-full text-xm">
                <thead className="bg-gray-100 p-50">
                  <tr>
                    <th className="p-2 text-left">Batch</th>
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-center">pH</th>
                    <th className="p-2 text-center">TDS</th>
                    <th className="p-2 text-center">Cl₂</th>
                    <th className="p-2 text-center">Microbiologi Test</th>
                    <th className="p-2 text-center">Chemical Test</th>
                    <th className="p-2 text-center">Physical Test</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((t: any) => (
                    <tr key={t.id} className="border-t">
                      <td className="p-2">{t.batch_number}</td>
                      <td className="p-2">{t.product}</td>
                      <td className="p-2">{t.date ? new Date(t.date).toLocaleDateString() : "-"}</td>
                      <td className="p-2 text-center">{t.ph_level ?? "-"}</td>
                      <td className="p-2 text-center">{t.tds_level ?? "-"}</td>
                      <td className="p-2 text-center">{t.chlorine ?? "-"}</td>
                      <td className="p-2 text-center capitalize">{t.microbioligy_test ?? "-"}</td>
                      <td className="p-2 text-center capitalize">{t.chemical_test ?? "-"}</td>
                      <td className="p-2 text-center capitalize">{t.physical_test ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default LaboratoryModule;
