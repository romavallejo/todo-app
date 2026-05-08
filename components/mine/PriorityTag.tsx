import { Text } from "react-native";

type PriorityTagProps = {
    priority: "LOW" | "MEDIUM" | "HIGH";
};

const PriorityTag = ({ priority }: PriorityTagProps) => {
    const priorityStyles = {
        LOW: {
            backgroundColor: "#DCFCE7",
            color: "#166534",
        },
        MEDIUM: {
            backgroundColor: "#FEF9C3",
            color: "#854D0E",
        },
        HIGH: {
            backgroundColor: "#FEE2E2",
            color: "#991B1B",
        },
    };

    return (
        <Text
            className="px-2 py-1 rounded-lg font-semibold self-start"
            style={priorityStyles[priority]}
        >
            {priority}
        </Text>
    );
};

export default PriorityTag;