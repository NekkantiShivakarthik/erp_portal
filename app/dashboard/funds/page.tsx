"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Wallet, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  FileText,
  Download,
  Eye,
  IndianRupee,
  Plus,
  Loader2,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function FundsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [funds, setFunds] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [schools, setSchools] = useState<any[]>([])
  const [summary, setSummary] = useState({
    totalAllocated: 0,
    totalUtilized: 0,
    totalPending: 0,
    percentUtilized: 0,
    pendingTransactions: 0,
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [fundDialogOpen, setFundDialogOpen] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    school_id: '',
    description: '',
    amount: '',
    category: '',
  })
  const [newFund, setNewFund] = useState({
    school_id: '',
    category: '',
    allocated_amount: '',
    financial_year: '2024-25',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    
    const [fundsRes, transactionsRes, schoolsRes] = await Promise.all([
      supabase.from('funds').select('*, schools(name)'),
      supabase.from('fund_transactions').select('*, schools(name), funds(category)').order('created_at', { ascending: false }),
      supabase.from('schools').select('*'),
    ])

    const fundsData = fundsRes.data || []
    const transactionsData = transactionsRes.data || []

    setFunds(fundsData)
    setTransactions(transactionsData)
    setSchools(schoolsRes.data || [])

    const totalAllocated = fundsData.reduce((sum, f) => sum + (f.allocated_amount || 0), 0)
    const totalUtilized = fundsData.reduce((sum, f) => sum + (f.utilized_amount || 0), 0)
    const pendingTxns = transactionsData.filter(t => t.status === 'pending').length

    setSummary({
      totalAllocated,
      totalUtilized,
      totalPending: totalAllocated - totalUtilized,
      percentUtilized: totalAllocated > 0 ? Math.round((totalUtilized / totalAllocated) * 100) : 0,
      pendingTransactions: pendingTxns,
    })
    
    setLoading(false)
  }

  const handleCreateFund = async () => {
    if (!newFund.school_id || !newFund.category || !newFund.allocated_amount) {
      toast.error('Please fill all required fields')
      return
    }

    const { error } = await supabase.from('funds').insert({
      school_id: newFund.school_id,
      category: newFund.category,
      allocated_amount: parseFloat(newFund.allocated_amount),
      utilized_amount: 0,
      financial_year: newFund.financial_year,
    })

    if (error) {
      toast.error('Failed to add fund allocation')
      return
    }

    toast.success('Fund allocation added successfully')
    setNewFund({ school_id: '', category: '', allocated_amount: '', financial_year: '2024-25' })
    setFundDialogOpen(false)
    await loadData()
  }

  const handleCreateTransaction = async () => {
    if (!newTransaction.school_id || !newTransaction.description || !newTransaction.amount || !newTransaction.category) {
      toast.error('Please fill all required fields')
      return
    }

    // Find matching fund
    const matchingFund = funds.find(f => 
      f.school_id === newTransaction.school_id && 
      f.category === newTransaction.category
    )

    if (!matchingFund) {
      toast.error('No fund allocation found for this school and category')
      return
    }

    const amount = parseFloat(newTransaction.amount)
    const availableFund = (matchingFund.allocated_amount || 0) - (matchingFund.utilized_amount || 0)
    
    if (amount > availableFund) {
      toast.error(`Insufficient funds! Available: ₹${availableFund.toLocaleString()}`)
      return
    }

    const { error } = await supabase.from('fund_transactions').insert({
      fund_id: matchingFund.id,
      school_id: newTransaction.school_id,
      description: newTransaction.description,
      amount: amount,
      category: newTransaction.category,
      status: 'pending',
    })

    if (error) {
      toast.error('Failed to create transaction')
      return
    }

    toast.success('Transaction created successfully')
    setNewTransaction({ school_id: '', description: '', amount: '', category: '' })
    setDialogOpen(false)
    await loadData()
  }

  const handleApproveTransaction = async (id: string) => {
    const txn = transactions.find(t => t.id === id)
    if (!txn) {
      toast.error('Transaction not found')
      return
    }

    // Update transaction status
    const { error: txnError } = await supabase
      .from('fund_transactions')
      .update({ status: 'completed' })
      .eq('id', id)

    if (txnError) {
      toast.error('Failed to approve transaction')
      return
    }
    
    // Update fund utilized amount
    if (txn.fund_id) {
      const fund = funds.find(f => f.id === txn.fund_id)
      if (fund) {
        const newUtilizedAmount = (fund.utilized_amount || 0) + (txn.amount || 0)
        const { error: fundError } = await supabase
          .from('funds')
          .update({ utilized_amount: newUtilizedAmount })
          .eq('id', fund.id)

        if (fundError) {
          toast.error('Failed to update fund allocation')
          return
        }
      }
    }
    
    toast.success(`Transaction approved! ₹${(txn.amount || 0).toLocaleString()} allocated`)
    await loadData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const hasNoData = schools.length === 0
  const pendingTransactions = transactions.filter(t => t.status === 'pending')

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fund Allocation & Transparency</h1>
          <p className="text-muted-foreground">
            Track fund allocation, utilization, and pending approvals
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={fundDialogOpen} onOpenChange={setFundDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={hasNoData}>
                <Plus className="h-4 w-4 mr-2" />
                Add Fund
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Fund Allocation</DialogTitle>
                <DialogDescription>Allocate funds to a school</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>School</Label>
                  <Select value={newFund.school_id} onValueChange={(v) => setNewFund({...newFund, school_id: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newFund.category} onValueChange={(v) => setNewFund({...newFund, category: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="infrastructure">Infrastructure Repairs</SelectItem>
                      <SelectItem value="teaching">Teaching Materials</SelectItem>
                      <SelectItem value="furniture">Furniture & Equipment</SelectItem>
                      <SelectItem value="sports">Sports & Activities</SelectItem>
                      <SelectItem value="technology">Technology & Digital</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Allocated Amount (₹)</Label>
                  <Input 
                    type="number"
                    value={newFund.allocated_amount}
                    onChange={(e) => setNewFund({...newFund, allocated_amount: e.target.value})}
                    placeholder="e.g., 100000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Financial Year</Label>
                  <Select value={newFund.financial_year} onValueChange={(v) => setNewFund({...newFund, financial_year: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-25">2024-25</SelectItem>
                      <SelectItem value="2025-26">2025-26</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setFundDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateFund}>Add Fund</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={hasNoData}>
                <Plus className="h-4 w-4 mr-2" />
                New Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Transaction</DialogTitle>
                <DialogDescription>Record a new fund utilization</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>School</Label>
                  <Select value={newTransaction.school_id} onValueChange={(v) => setNewTransaction({...newTransaction, school_id: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                    placeholder="e.g., Furniture purchase - 15 benches"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newTransaction.category} onValueChange={(v) => setNewTransaction({...newTransaction, category: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="infrastructure">Infrastructure Repairs</SelectItem>
                      <SelectItem value="teaching">Teaching Materials</SelectItem>
                      <SelectItem value="furniture">Furniture & Equipment</SelectItem>
                      <SelectItem value="sports">Sports & Activities</SelectItem>
                      <SelectItem value="technology">Technology & Digital</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount (₹)</Label>
                  <Input 
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                    placeholder="e.g., 45000"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateTransaction}>Create Transaction</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {hasNoData && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <AlertCircle className="h-10 w-10 text-orange-500" />
              <div>
                <h3 className="font-medium">No Schools Found</h3>
                <p className="text-sm text-muted-foreground">
                  Add schools first before managing funds.
                </p>
                <Button asChild className="mt-2" size="sm">
                  <Link href="/dashboard/settings">Go to Settings</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fund Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Allocated</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(summary.totalAllocated / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">Current financial year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Utilized</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{(summary.totalUtilized / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">{summary.percentUtilized}% of allocation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Utilization</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₹{(summary.totalPending / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">Available for use</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.pendingTransactions}</div>
            <p className="text-xs text-muted-foreground">Requests awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Category-wise Breakdown */}
      {funds.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Category-wise Fund Allocation</CardTitle>
            <CardDescription>Breakdown of funds by spending category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funds.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.category} - {(item.schools as any)?.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-green-600">₹{((item.utilized_amount || 0) / 1000).toFixed(0)}K used</span>
                      <span className="text-muted-foreground">of ₹{((item.allocated_amount || 0) / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                  <Progress 
                    value={item.allocated_amount > 0 ? ((item.utilized_amount || 0) / item.allocated_amount) * 100 : 0} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="approvals">Pending Approvals ({pendingTransactions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest fund utilization records</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No transactions recorded yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.slice(0, 10).map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell>
                          <p className="font-medium">{txn.description}</p>
                        </TableCell>
                        <TableCell>{(txn.schools as any)?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{txn.category || 'General'}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          ₹{(txn.amount || 0).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              txn.status === "completed"
                                ? "bg-green-500"
                                : txn.status === "approved"
                                ? "bg-blue-500"
                                : "bg-orange-500"
                            }
                          >
                            {txn.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(txn.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle>Pending Fund Requests</CardTitle>
              <CardDescription>Requests awaiting approval from officials</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingTransactions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No pending requests.
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingTransactions.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">{request.description}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{(request.schools as any)?.name || 'School'}</span>
                          <span>•</span>
                          <span>{request.category || 'General'}</span>
                          <span>•</span>
                          <span>{new Date(request.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold">₹{(request.amount || 0).toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Requested Amount</p>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => handleApproveTransaction(request.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
