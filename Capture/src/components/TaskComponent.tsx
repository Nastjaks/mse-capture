import React, {useState, useEffect} from "react";
import {IonAlert, IonButton, IonContent, IonIcon, IonInput, IonItem, IonModal, IonText} from "@ionic/react";
import {camera, checkmark, trash} from "ionicons/icons";
import {createTask, deleteTask, getTasks} from "../services/taskService";
import {Task} from "../models/Task";
import {useToast} from "../contexts/ToastContext";
import {Link} from "react-router-dom";

interface TaskComponentProps {
    galleryId: string;
    isTaskManagerOpen: boolean;
}

const TaskComponent: React.FC<TaskComponentProps> = ({galleryId, isTaskManagerOpen}) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskTitle, setTaskTitle] = useState("");
    const [showDeleteConfirm_Task, setShowDeleteConfirm_Task] = useState(false);
    const [taskToDelete, settaskToDelete] = useState<Task | null>(null);

    const {showToast} = useToast();

    useEffect(() => {
        fetchTasks();
    }, [galleryId]);

    const fetchTasks = async () => {
        try {
            const tasks = await getTasks(galleryId);
            if (tasks) setTasks(tasks);
        } catch (err) {
            console.error("Fehler beim Laden der Aufgaben:", err);
        }
    };

    const handleAddTask = async () => {
        console.log(taskTitle);
        if (!taskTitle) {
            showToast("Task required");
            return;
        }
        try {
            const task = await createTask(taskTitle, galleryId);
            if (task) {
                await fetchTasks();
                setTaskTitle("");
            }
        } catch (err) {
            console.error("Fehler beim Erstellen der Aufgabe:", err);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            const result = await deleteTask(taskId);
            if (result) {
                showToast("Task gelöscht");
                await fetchTasks();
            }
        } catch (err) {
            console.error("Fehler beim Löschen der Aufgabe:", err);
            showToast("Fehler beim Löschen der Aufgabe.");
        }
    };

    return (
        <div className="ion-padding">
            {tasks.length > 0 ? (
                tasks.map((task) => (
                    <div key={task.id}>
                        <Link to={`/gallery/${galleryId}/${task.id}`} className="task-item">
                            <div className="task-def">
                                <IonIcon aria-hidden="true" icon={camera}/>
                                <p>{task.task}</p>
                            </div>
                            <div>
                                <IonIcon className="task-item-check" aria-hidden="true" icon={checkmark}/>
                            </div>
                        </Link>
                    </div>
                ))
            ) : (
                <p>No tasks for this gallery.</p>
            )}

            {/* Delete-Bestätigungsdialog Tastk */}
            <IonAlert
                isOpen={showDeleteConfirm_Task}
                onDidDismiss={() => setShowDeleteConfirm_Task(false)}
                header={'Delete Task'}
                message={`Do you really want to delete this task?
                        ${taskToDelete?.task}`}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => setShowDeleteConfirm_Task(false),
                    },
                    {
                        text: 'Delete',
                        handler: () => {
                            if (taskToDelete) {
                                handleDeleteTask(taskToDelete.id); // Aktuelle Task-ID übergeben
                                setShowDeleteConfirm_Task(false);
                            }
                        },
                    },
                ]}
            />

            {/* Task Manager Modal */}
            <IonModal
                isOpen={isTaskManagerOpen}
                className="task-manager-modal"
                initialBreakpoint={.9}
                showBackdrop={true}
                handleBehavior="none"
            >

                <div>

                    <p>Task Manager | {galleryId}</p>

                    <IonContent className="ion-padding">
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <div key={task.id} className="task-item">
                                    <div className="task-def">
                                        <IonIcon aria-hidden="true" icon={camera}/>
                                        <p>{task.task}</p>
                                    </div>
                                    <div>
                                        <IonIcon
                                            className="item-trash"
                                            onClick={() => {
                                                setShowDeleteConfirm_Task(true);
                                                settaskToDelete(task);
                                            }}
                                            aria-hidden="true"
                                            icon={trash}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No tasks for this gallery.</p>
                        )}
                    </IonContent>

                    <div className="form-container-row">
                        <IonItem>
                            <IonInput
                                placeholder="Task..."
                                labelPlacement="floating"
                                value={taskTitle}
                                type="text"
                                onIonInput={(e) => setTaskTitle(e.detail.value!)}
                            >
                                <div slot="label">
                                    Task<IonText>*</IonText>
                                </div>
                            </IonInput>
                        </IonItem>
                        <IonButton expand="block" onClick={handleAddTask}>
                            Add Task
                        </IonButton>
                    </div>
                </div>

            </IonModal>

        </div>

    );
};

export default TaskComponent;
