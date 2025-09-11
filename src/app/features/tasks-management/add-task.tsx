"use client";
import { MyModalRef, TMModal } from "@/app/components";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Ref, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AddTaskForm } from ".";
import { useQueryClient } from "@tanstack/react-query";
import { useGlobalNotification } from "@/app/providers";
import { addTaskSchema } from "@/app/lib";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useCreateTaskMutation,
  useGetTasksQuery,
} from "@/graphql/generated/graphql";

export interface AddTaskModalProps {
  modalRef: Ref<MyModalRef>;
}

export interface TaskInput {
  title: string;
  description: string;
  assigneeId?: string;
}

export function AddTask() {
  const modalRef = useRef<MyModalRef>(null);
  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => modalRef.current?.open()}
      >
        Add Task
      </Button>
      <AddTaskModal modalRef={modalRef} />
    </>
  );
}

function AddTaskModal({ modalRef }: AddTaskModalProps) {
  //Hooks
  const queryClient = useQueryClient();
  const { openNotification } = useGlobalNotification();

  //Form Hooks
  const methods = useForm<TaskInput>({
    resolver: yupResolver(addTaskSchema),
    mode: "all",
  });
  const { reset, handleSubmit } = methods;

  //Mutation
  const { mutateAsync: createNewTaskFn, isPending } = useCreateTaskMutation({
    onSuccess: () => {
      openNotification({
        type: "success",
        description: "Task has been added successfully!",
      });
      reset();
      queryClient.invalidateQueries({
        queryKey: useGetTasksQuery.getKey(),
        exact: false,
      });
      if (modalRef && "current" in modalRef) {
        modalRef.current?.close();
      }
    },
    onError: (error: Error) => {
      openNotification({
        type: "error",
        description: error?.message ?? "Failed to create user",
      });
    },
  });

  const handleAddTask = async (data: TaskInput) => {
    await createNewTaskFn({
      input: data,
    });
  };

  return (
    <TMModal
      okButtonProps={{
        icon: <PlusOutlined />,
        htmlType: "submit",
      }}
      width={700}
      ref={modalRef}
      title="Add New Task"
      okText="Yes, Add"
      maskClosable={false}
      confirmLoading={isPending}
      onCancel={reset}
      afterClose={reset}
      modalRender={(dom) => (
        <form onSubmit={handleSubmit(handleAddTask)}>{dom}</form>
      )}
    >
      <FormProvider {...methods}>
        <AddTaskForm />
      </FormProvider>
    </TMModal>
  );
}
