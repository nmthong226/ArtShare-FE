// src/components/NotificationsPanel.tsx
import React, { useEffect } from 'react';
import { useNotifications, ReportResolvedPayload } from '../hooks/useNotifications';

interface Props {
  userId: string;
}

export const NotificationsPanel: React.FC<Props> = ({ userId }) => {
  const { notifications } = useNotifications(userId);

  useEffect(() => {

  }, [notifications])

  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', maxWidth: 400 }}>
      <h3>Your Notifications</h3>
      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <ul>
          {notifications.map((notif: ReportResolvedPayload, idx) => (
            <li key={idx}>
              📢 {notif.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
