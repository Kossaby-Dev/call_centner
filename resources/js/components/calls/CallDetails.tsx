import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
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
    PhoneForwarded,
    PhoneOff,
    Mic,
    MicOff,
    Clock,
    MessageSquare,
} from "lucide-react";


interface Call {
    id: number;
    client_name: string;
    client_phone: string;
    status: "incoming" | "active" | "on-hold" | "ended";
    duration: number | null;
    notes: string | null;
    satisfaction_rating: number | null;
    created_at: string;
}

interface CallDetailsProps {
    userRole: 'agent' | 'supervisor';
    call: Call;
    agents?: Array<{
        id: number;
        name: string;
    }>;
    onStartCall?: (callId: number, duration: number) => void;
    onPauseCall?: (callId: number, duration: number) => void;
    onEndCall?: (callId: number, duration: number) => void;
    onNewTicket?: (callId: number) => void;
    onTransferCall?: (callId: number) => void

}

const CallDetails: React.FC<CallDetailsProps> = ({
    call,
    agents,
    userRole,
    onStartCall = () => { },
    onPauseCall = () => { },
    onEndCall = () => { },
    onNewTicket = () => { },
    onTransferCall = () => {},
}) => {
    // Mock data for demonstration
    const [activeCall, setActiveCall] = useState(call);

    useEffect(() => {
        setActiveCall(call);
    }, [call]); // Thi
    // State for UI controls
    const [isRecording, setIsRecording] = useState(false);
    const [transferDialogOpen, setTransferDialogOpen] = useState(false);
    const [createTicketDialogOpen, setCreateTicketDialogOpen] = useState(false);
    const [micDuration, setMicDuration] = useState(0);
    const [displayDuration, setDisplayDuration] = useState(activeCall.duration || 0);
    // Timer for mic recording
    useEffect(() => {
        let interval: any;

        if (isRecording) {
            onStartCall(activeCall.id, (activeCall.duration || 0))
            setActiveCall(prev => ({
                ...prev,
                status: "active"
            }));
            interval = setInterval(() => {
                setMicDuration(prev => prev + 1);
                setDisplayDuration((activeCall.duration || 0) + micDuration + 1);
            }, 1000);
        } else {
            // When recording stops, add the mic duration to the call duration
            if (micDuration > 0) {
                onPauseCall(activeCall.id, (activeCall.duration || 0) + micDuration)
                setActiveCall(prev => ({
                    ...prev,
                    duration: (prev.duration || 0) + micDuration,
                    status: "on-hold"
                }));
                setMicDuration(0);
                setDisplayDuration((activeCall.duration || 0) + micDuration);
            }
        }

        return () => clearInterval(interval);
    }, [isRecording, micDuration, activeCall.duration]);

    // For demonstration purposes
    const setCallNotes = (notes: string) => {
        setActiveCall(prev => ({ ...prev, notes }));
    };

    // const handleTransferCall = (agentId: string) => {
    //     console.log("Transferring call to agent:", agentId);
    //     setTransferDialogOpen(false);
    // };

    const handleCreateTicket = () => {
        onNewTicket(activeCall.id)
    };


    const handleTransferCall = () => {
        onTransferCall(activeCall.id)
    };

    const handleEndCall = (callId: number) => {
        if (!isRecording) {
            onEndCall(callId, activeCall.duration || 0)
        }

    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-500";
            case "on-hold":
                return "bg-yellow-500";
            case "transferring":
                return "bg-blue-500";
            default:
                return "bg-gray-500";
        }
    };

    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;

        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Active Call Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center justify-center">
                        <Avatar className="h-24 w-24 mb-4">
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
                        <div className="flex items-center mt-2 text-sm">
                            <Clock size={14} className="inline mr-1" />
                            <span>{formatDuration(displayDuration)}</span>
                            {isRecording && (
                                <span className="ml-2 flex items-center text-red-500">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
                                    Mic On
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="col-span-2">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium mb-2">Call Notes</h4>
                                <Input
                                    placeholder="Add notes about this call..."
                                    value={activeCall.notes || ""}
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
                                <Button variant="outline"
                                    size="sm"
                                    onClick={handleTransferCall}>
                                    <PhoneForwarded size={16} className="mr-1" />{" "}
                                    Transfer
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCreateTicket}
                                >
                                    <MessageSquare size={16} className="mr-1" /> Create Ticket
                                </Button>
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
    );
}


export default CallDetails;