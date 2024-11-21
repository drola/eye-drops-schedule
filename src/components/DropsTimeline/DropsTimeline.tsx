import { useEffect } from 'react';
import { Button, Text, Timeline } from '@mantine/core';
import { useScrollIntoView } from '@mantine/hooks';
import { Prescription } from '@/utils/calculator';

interface DropsTimelineProps {
  timeline: { time: string; prescription: Prescription }[];
  nextItemIndex: number;
  onItemDone: (index: number) => void;
}

export const DropsTimeline = (props: DropsTimelineProps) => {
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({});

  useEffect(() => {
    scrollIntoView({ alignment: 'center' });
  }, [props.nextItemIndex]);

  return (
    <div>
      <Timeline active={props.nextItemIndex}>
        {props.timeline.map((item, i) => (
          <Timeline.Item
            title={item.prescription.name}
            key={item.time}
            ref={i === props.nextItemIndex ? targetRef : null}
          >
            <Text size="sm" c="dimmed">
              {new Date(item.time).toLocaleTimeString()}
            </Text>
            {i === props.nextItemIndex && <Button onClick={() => props.onItemDone(i)}>Done</Button>}
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
};
