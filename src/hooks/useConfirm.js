"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";

export function useConfirm() {
  const [state, setState] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
    loading: false,
  });

  const confirm = ({ title = "Are you sure?", message = "" }) =>
    new Promise((resolve) => {
      setState({
        open: true,
        title,
        message,
        loading: false,
        onConfirm: () => {
          setState((prev) => ({ ...prev, open: false }));
          resolve(true);
        },
      });
    });

  const close = () => setState((prev) => ({ ...prev, open: false }));

  const ConfirmDialog = () => (
    <Modal
      open={state.open}
      onClose={close}
      title={state.title}
      onConfirm={state.onConfirm}
      loading={state.loading}
      variant="danger"
      confirmLabel="Confirm"
    >
      {state.message}
    </Modal>
  );

  return { confirm, ConfirmDialog };
}
