import { useMemo } from 'react';
import { AppShell, Burger, Button, Group, Stack } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useTimeline } from '@/hooks/useTimeline';
import { DropsTimeline } from '../components/DropsTimeline/DropsTimeline';

export function HomePage() {
  const timeline = useTimeline();
  const startOfDay = useMemo(
    () => new Date(timeline.state.startOfDay),
    [timeline.state.startOfDay]
  );
  const endOfDay = useMemo(() => new Date(timeline.state.endOfDay), [timeline.state.endOfDay]);

  const [drawerOpened, { toggle: drawerToggle }] = useDisclosure(false);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { desktop: !drawerOpened, mobile: !drawerOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={drawerOpened} onClick={drawerToggle} />
          Eye Drops Schedule
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Stack gap="md">
          <DateTimePicker
            label="Day start"
            placeholder="Pick date and time"
            value={startOfDay}
            onChange={(value) => timeline.dispatch({ type: 'setStartOfDay', value })}
          />

          <DateTimePicker
            label="Day end"
            placeholder="Pick date and time"
            value={endOfDay}
            onChange={(value) => timeline.dispatch({ type: 'setEndOfDay', value })}
          />

          <Button onClick={() => timeline.dispatch({ type: 'wakeup' })}>Wake up!</Button>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <DropsTimeline
          timeline={timeline.state.items}
          nextItemIndex={timeline.state.nextItemIndex}
          onItemDone={() => timeline.dispatch({ type: 'goToNextStep' })}
        />
      </AppShell.Main>
    </AppShell>
  );
}
