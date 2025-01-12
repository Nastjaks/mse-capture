import React, {useState, useEffect} from "react";
import {IonAlert, IonButton, IonContent, IonIcon, IonInput, IonItem, IonModal, IonText} from "@ionic/react";
import {camera, checkmark, trash} from "ionicons/icons";
import {createTask, deleteTask, getTasks} from "../services/taskService";
import {Task} from "../models/Task";
import {useToast} from "../contexts/ToastContext";
import {menuController} from "@ionic/core/components";
import {Link} from "react-router-dom";

//{gallery && <TaskComponent galleryId={galleryId} />}

interface TaskComponentProps {
    galleryId: string;
}

const TaskComponent: React.FC<TaskComponentProps> = ({galleryId}) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskTitle, setTaskTitle] = useState("");
    const [showDeleteConfirm_Task, setShowDeleteConfirm_Task] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
    const {showToast} = useToast();

    useEffect(() => {
        loadTasks();
    }, [galleryId]);

    const loadTasks = async () => {
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
                await loadTasks();
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
                await loadTasks();
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
                message={'Do you really want to delete this task?'}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => setShowDeleteConfirm_Task(false),
                    },
                    {
                        text: 'Delete',
                        handler: () => {
                            if (currentTaskId) {
                                handleDeleteTask(currentTaskId); // Aktuelle Task-ID übergeben
                                setShowDeleteConfirm_Task(false);
                            }
                        },
                    },
                ]}
            />

            {/* Task Manager Modal */}
            <IonModal
                className="task-manager-modal"
                trigger="open-task-manager"
                initialBreakpoint={.9}
                showBackdrop={true}
                handleBehavior="none"
                onWillPresent={async () => await menuController.close()}
            >
                <div className="ion-padding">
                    <p>Task Manager V2</p>
                    <p>{galleryId}</p>
                    <div>
                        <p>Create Task</p>
                        <div className="form-container">
                            <IonItem>
                                <IonInput
                                    placeholder="Task..."
                                    labelPlacement="floating"
                                    value={taskTitle}
                                    type="text"
                                    onIonChange={(e) => setTaskTitle(e.detail.value!)}
                                >
                                    <div slot="label">
                                        Task<IonText>*</IonText>
                                    </div>
                                </IonInput>
                            </IonItem>
                            <IonButton expand="block" onClick={handleAddTask} shape="round">
                                Add Task
                            </IonButton>
                        </div>
                    </div>
                </div>

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
                                            setCurrentTaskId(task.id);
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
            </IonModal>

        </div>

    );
};

export default TaskComponent;
