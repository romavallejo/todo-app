import { TaskList } from "@/types/TaskList";
import React from "react";
import { Pressable } from "react-native";
import { Box } from "../ui/box";
import { Progress, ProgressFilledTrack } from "../ui/progress";
import { Text } from "../ui/text";

const TaskListCard: React.FC<{ item: TaskList }> = ({ item }) => {
  return (
    <Pressable className="p-4 border-gray-300 rounded-xs mb-0">
      {/* Titulo */}
      <Text className="text-lg font-semibold">{item.title}</Text>

      {/* Subtitulo */}
      <Text className="text-green-500 text-sm mb-2">{item.subtitle}</Text>

      {/* Progess */}
      <Box className="mb-3">
        <Progress value={item.percentage} size="md">
          <ProgressFilledTrack />
        </Progress>
        <Text className="text-xs text-gray-500 mt-1">
          {item.percentage}% completed
        </Text>
      </Box>

      {/* Tags */}

    </Pressable>
  );
};

export default TaskListCard;