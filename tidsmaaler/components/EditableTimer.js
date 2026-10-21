import React from 'react';

import TimerForm from './TimerForm';
import Timer from './Timer'

export default function EditableTimer({ timer, onUpdate, onToggle, onDelete }) {
    const [isEditing, setIsEditing] = React.useState(false);

    if (isEditing) {
        return (
            <TimerForm
                id={timer.id}
                title={timer.title}
                project={timer.project}
                onSubmit={(attributes) => {
                    onUpdate({ ...timer, ...attributes });
                    setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

    return (
        <Timer
            timer={timer}
            onEdit={() => setIsEditing(true)}
            onToggle={onToggle}
            onDelete={onDelete}
        />
    );
}
    