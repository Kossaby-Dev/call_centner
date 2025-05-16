import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/call/card";
import { Button } from "@/components/ui/call/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/call/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/call/avatar";
import { Badge } from "@/components/ui/call/badge";
import { Separator } from "@/components/ui/call/separator";
import { Input } from "@/components/ui/call/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/call/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/call/select";
import {
  Phone,
  PhoneCall,
  PhoneForwarded,
  PhoneOff,
  Mic,
  MicOff,
  UserPlus,
  Clock,
  MessageSquare,
  Plus
} from "lucide-react";
import { router, usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";

interface PageProps extends InertiaPageProps {
  auth: {
    user: {
      id: number;
      name: string;
      role: string;
    };
  };
}

interface Call {
  id: number;
  client_name: string;
  client_phone: string;
  call_type: 'entrant' | 'sortant';
  status: "incoming" | "active" | "on-hold" | "ended";
  duration: number | null;
  notes: string | null;
  satisfaction_rating: number | null;
  created_at: string;
}

interface CallManagementProps {
  userRole: 'agent' | 'supervisor';
  calls: Call[];
  agents?: Array<{
    id: number;
    name: string;
  }>;
  links: any;
}

const CallManagement: React.FC<CallManagementProps> = ({
  userRole,
  calls,
  agents,
  links,
}) => {
  const { auth } = usePage<PageProps>().props;
  const [activeCallId, setActiveCallId] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [createTicketDialogOpen, setCreateTicketDialogOpen] = useState(false);
  const [newCallDialogOpen, setNewCallDialogOpen] = useState(false);
  const [callNotes, setCallNotes] = useState("");
  const [newCallData, setNewCallData] = useState({
    client_name: "",
    client_phone: "",
    call_type: "entrant",
    status: "active",
    subject: "",
    notes: "",
  });

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'missed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const activeCall = calls.find((call) => call.id === activeCallId);

  const handleAnswerCall = (callId: number) => {
    router.put(route('calls.update', callId), {
      status: 'active',
    });
  };

  const handleEndCall = (callId: number) => {
    router.put(route('calls.update', callId), {
      status: 'ended',
    });
  };

  const handleTransferCall = (agentId: any) => {
    if (activeCallId) {
      router.put(route('calls.update', activeCallId), {
        agent_id: agentId,
      });
      setTransferDialogOpen(false);
    }
  };

  const handleCreateTicket = () => {
    if (activeCallId) {
      router.post(route('tickets.store'), {
        call_id: activeCallId,
        notes: callNotes,
      });
      setCreateTicketDialogOpen(false);
      setCallNotes("");
    }
  };

  const handleCreateNewCall = () => {
    if (!newCallData.client_name || !newCallData.client_phone) {
      alert('Please fill in all required fields');
      return;
    }

    router.post(route('calls.store'), {
      ...newCallData,
      user_id: auth.user.id,
      call_time: new Date().toISOString(),
      status: 'active',
    }, {
      onSuccess: () => {
        setNewCallDialogOpen(false);
        setNewCallData({
          client_name: "",
          client_phone: "",
          call_type: "entrant",
          status: "active",
          subject: "",
          notes: "",
        });
      },
      onError: (errors) => {
        alert('Error creating call: ' + Object.values(errors).join(', '));
      },
    });
  };

  return (
    <div className="bg-background w-full p-4 rounded-lg">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Call Management</h2>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setNewCallDialogOpen(true)}
          >
            <Plus size={16} />
            New Call
          </Button>
        </div>

        <Tabs defaultValue="active">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active Calls</TabsTrigger>
            <TabsTrigger value="incoming">Incoming Calls</TabsTrigger>
            <TabsTrigger value="history">Call History</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 mt-4">
            {calls.filter((call) => ["active", "on-hold"].includes(call.status)).length  > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {calls
                  .filter((call) => ["active", "on-hold"].includes(call.status))
                  .map((call) => (
                    <Card
                      key={call.id}
                      className={`overflow-hidden ${call.id === activeCallId ? "border-primary" : ""}`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${getStatusColor(call.status)}`}
                            ></div>
                            <CardTitle>{call.client_name}</CardTitle>
                          </div>
                          <Badge variant={
                              call.status === "active" ? "default" : "outline"
                            }>
                            {call.status === "active" ? "Active" : "On Hold"}
                          </Badge>
                        </div>
                        {auth.user.role == "agent" && (
                          <CardDescription>
                            Handled by: {auth.user.name}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={16} className="text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {formatDuration(call.duration)}
                          </span>
                        </div>
                        {call.notes && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {call.notes}
                          </p>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between pt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveCallId(call.id)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleEndCall(call.id)}
                        >
                          <PhoneOff size={16} className="mr-1" /> End
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground">
                    No active calls at the moment
                  </p>
                  <Button variant="outline" className="mt-4">
                    <PhoneCall size={16} className="mr-2" /> Make a call
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="incoming" className="space-y-4 mt-4">
            {calls.filter((call) => ["incoming"].includes(call.status)).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {calls
                  .filter((call) => call.status === 'incoming')
                  .map((call) => (
                    <Card key={call.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <CardTitle>{call.client_name}</CardTitle>
                          </div>
                          <Badge variant="secondary">Incoming</Badge>
                        </div>
                        <CardDescription>
                          {new Date(call.created_at).toLocaleString()}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between pt-0"> 
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEndCall(call.id)}
                        >
                          Decline
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleAnswerCall(call.id)}
                        >
                          <Phone size={16} className="mr-1" /> Answer
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCreateTicketDialogOpen(true)}
                        >
                          <MessageSquare size={16} className="mr-1" /> Create Ticket
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground">No incoming calls at the moment</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            {calls.filter((call) => call.status === 'ended').length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {calls
                  .filter((call) => call.status === 'ended')
                  .map((call) => (
                    <Card key={call.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <CardTitle>{call.client_name}</CardTitle>
                          </div>
                          <Badge variant="outline">Completed</Badge>
                        </div>
                        <CardDescription>
                          {new Date(call.created_at).toLocaleString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={16} className="text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Duration: {formatDuration(call.duration)}
                          </span>
                        </div>
                        {call.satisfaction_rating && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Satisfaction: {call.satisfaction_rating}/5
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground">No call history</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Transfer Call Dialog */}
        <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transfer Call</DialogTitle>
              <DialogDescription>
                Select an agent to transfer the call to
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Select onValueChange={(value) => handleTransferCall(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents?.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id.toString()}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </DialogContent>
        </Dialog>

        
        {activeCall && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Active Call Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center justify-center">
                  <Avatar className="h-24 w-24 mb-4">
                    {/* <AvatarImage src={activeCall.callerAvatar} /> */}
                    <AvatarFallback className="text-2xl">
                      {activeCall.client_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold">
                    {activeCall.client_name}
                  </h3>
                  <p className="text-muted-foreground">
                    {activeCall.client_phone}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusColor(activeCall.status)}`}
                    ></div>
                    <span className="capitalize">{activeCall.status}</span>
                  </div>
                  <p className="mt-2 text-sm">
                    <Clock size={14} className="inline mr-1" />
                    {formatDuration(activeCall.duration)}
                  </p>
                </div>

                <div className="col-span-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Call Notes</h4>
                      <Input
                        placeholder="Add notes about this call..."
                        value={callNotes}
                        onChange={(e) => setCallNotes(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={isRecording ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => setIsRecording(!isRecording)}
                      >
                        {isRecording ? (
                          <MicOff size={16} className="mr-1" />
                        ) : (
                          <Mic size={16} className="mr-1" />
                        )}
                        {isRecording ? "Stop Recording" : "Start Recording"}
                      </Button>

                      <Dialog
                        open={transferDialogOpen}
                        onOpenChange={setTransferDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <PhoneForwarded size={16} className="mr-1" />{" "}
                            Transfer
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Transfer Call</DialogTitle>
                            <DialogDescription>
                              Select an agent to transfer this call to.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Select onValueChange={handleTransferCall}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an agent" />
                                </SelectTrigger>
                                <SelectContent>
                                  {/* {availableAgents.map((agent) => (
                                    <SelectItem
                                      key={agent.id}
                                      value={agent.id}
                                      disabled={agent.status !== "available"}
                                    >
                                      {agent.name}{" "}
                                      {agent.status !== "available" && "(Busy)"}
                                    </SelectItem>
                                  ))} */}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setTransferDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog
                        open={createTicketDialogOpen}
                        onOpenChange={setCreateTicketDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MessageSquare size={16} className="mr-1" /> Create
                            Ticket
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create Support Ticket</DialogTitle>
                            <DialogDescription>
                              Create a ticket for this call to track follow-up
                              actions.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <label
                                htmlFor="ticket-title"
                                className="text-sm font-medium"
                              >
                                Ticket Title
                              </label>
                              <Input
                                id="ticket-title"
                                placeholder="Enter ticket title"
                              />
                            </div>
                            <div className="grid gap-2">
                              <label
                                htmlFor="ticket-description"
                                className="text-sm font-medium"
                              >
                                Description
                              </label>
                              <Input
                                id="ticket-description"
                                placeholder="Enter ticket description"
                              />
                            </div>
                            <div className="grid gap-2">
                              <label
                                htmlFor="ticket-priority"
                                className="text-sm font-medium"
                              >
                                Priority
                              </label>
                              <Select>
                                <SelectTrigger id="ticket-priority">
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setCreateTicketDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleCreateTicket}>
                              Create Ticket
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleEndCall(activeCall.id)}
                      >
                        <PhoneOff size={16} className="mr-1" /> End Call
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

       

        {/* New Call Dialog */}
        <Dialog open={newCallDialogOpen} onOpenChange={setNewCallDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Call</DialogTitle>
              <DialogDescription>
                Enter the details for the new call
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="client_name" className="text-sm font-medium">
                  Client Name *
                </label>
                <Input
                  id="client_name"
                  placeholder="Enter client name"
                  value={newCallData.client_name}
                  onChange={(e) => 
                    setNewCallData(prev => ({ ...prev, client_name: e.target.value }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="client_phone" className="text-sm font-medium">
                  Client Phone *
                </label>
                <Input
                  id="client_phone"
                  placeholder="Enter client phone number"
                  value={newCallData.client_phone}
                  onChange={(e) => 
                    setNewCallData(prev => ({ ...prev, client_phone: e.target.value }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="call_type" className="text-sm font-medium">
                  Call Type
                </label>
                <Select
                  value={newCallData.call_type}
                  onValueChange={(value) => 
                    setNewCallData(prev => ({ ...prev, call_type: value }))
                  }
                >
                  <SelectTrigger id="call_type">
                    <SelectValue placeholder="Select call type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrant">Entrant</SelectItem>
                    <SelectItem value="sortant">Sortant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="call_type" className="text-sm font-medium">
                  Status
                </label>
                <Select
                  value={newCallData.status}
                  onValueChange={(value) => 
                    setNewCallData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select Call Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="incoming">Incoming</SelectItem>
                    <SelectItem value="ended">Ended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="Enter call subject"
                  value={newCallData.subject}
                  onChange={(e) => 
                    setNewCallData(prev => ({ ...prev, subject: e.target.value }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Notes
                </label>
                <Input
                  id="notes"
                  placeholder="Enter call notes"
                  value={newCallData.notes}
                  onChange={(e) => 
                    setNewCallData(prev => ({ ...prev, notes: e.target.value }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewCallDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateNewCall}>Create Call</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CallManagement;
