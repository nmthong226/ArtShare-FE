// PostScheduler.tsx
import * as React from "react";
import {
    Box,
    Typography,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
} from "@mui/material";
import {
    DatePicker,
    TimePicker,
    LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

export default function PostScheduler() {
    const [date, setDate] = React.useState<Dayjs | null>(dayjs());
    const [time, setTime] = React.useState<Dayjs | null>(dayjs());
    const [timezone, setTimezone] = React.useState<string>("Asia/Ho_Chi_Minh");

    const handleTimezoneChange = (event: SelectChangeEvent<string>) => {
        setTimezone(event.target.value);
    };

    const handleClear = () => {
        setDate(null);
        setTime(null);
    };

    const handleSchedule = () => {
        const formatted = `${date?.format("YYYY-MM-DD")} ${time?.format("HH:mm")} (${timezone})`;
        console.log("Scheduled:", formatted);
    };

    return (
        <Box
            p={2}
            sx={{ backgroundColor: "white", borderRadius: 2, boxShadow: 2, maxWidth: '576px' }}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <DatePicker
                        label="Date"
                        value={date}
                        onChange={(newValue) => setDate(newValue)}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                size: "small",
                            },
                        }}
                    />
                    <TimePicker
                        label="Time"
                        value={time}
                        onChange={(newValue) => setTime(newValue)}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                size: "small",
                            },
                        }}
                    />
                </Stack>
            </LocalizationProvider>
            <FormControl fullWidth margin="normal">
                <InputLabel id="timezone-label">Timezone</InputLabel>
                <Select
                    labelId="timezone-label"
                    value={timezone}
                    label="Timezone"
                    onChange={handleTimezoneChange}
                >
                    <MenuItem value="Asia/Ho_Chi_Minh">Vietnam (GMT+7)</MenuItem>
                    <MenuItem value="Asia/Tokyo">Japan (GMT+9)</MenuItem>
                    <MenuItem value="Europe/London">London (GMT+0)</MenuItem>
                    <MenuItem value="America/New_York">New York (GMT-5)</MenuItem>
                    <MenuItem value="UTC">UTC</MenuItem>
                </Select>
            </FormControl>

            {date && time && (
                <Box mt={2} p={2} sx={{ bgcolor: "#f0f4ff", borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Scheduled:
                    </Typography>
                    <Typography variant="subtitle2">
                        {date.format("YYYY-MM-DD")} at {time.format("HH:mm")} ({timezone})
                    </Typography>
                </Box>
            )}

            <Box mt={3} display="flex" justifyContent="space-between">
                <Button onClick={handleClear} color="secondary">
                    Clear
                </Button>
                <Button variant="contained" onClick={handleSchedule}>
                    Schedule
                </Button>
            </Box>
        </Box>
    );
}
