const today = new Date().setHours(0, 0, 0, 0);

  const upcomingMeetings = meetings.filter((meeting) => {
    const meetingDate = new Date(meeting.meetingDate).setHours(0, 0, 0, 0);
    return meetingDate >= today;
  }).length;