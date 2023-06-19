import * as ToastPrimitive from "@radix-ui/react-toast";

type ToastProps = {
  type: "info" | "error";
  message: string;
  onCloseCallback: () => void;
};

const Toast = ({ message, onCloseCallback }: ToastProps) => {
  return (
    <ToastPrimitive.Provider>
      <ToastPrimitive.Root
        className="fixed inset-x-4 bottom-auto left-auto right-4 top-4 z-50 w-full max-w-sm rounded-lg bg-white shadow-lg focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 radix-state-closed:animate-toast-hide radix-state-open:animate-toast-slide-in-right radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease] radix-swipe-direction-right:translate-x-radix-toast-swipe-move-x radix-swipe-direction-right:radix-swipe-end:animate-toast-swipe-out-x dark:bg-gray-800"
        onOpenChange={(isOpen) => {
          if (!isOpen) onCloseCallback();
        }}
      >
        <div className="flex">
          <div className="flex w-0 flex-1 items-center py-4 pl-5">
            <div className="w-full">
              <ToastPrimitive.Description className="mt-1 text-sm text-gray-700 dark:text-gray-400">
                {message}
              </ToastPrimitive.Description>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col space-y-1 px-3 py-2">
              <div className="flex h-0 flex-1">
                <ToastPrimitive.Close className="flex w-full items-center justify-center rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 dark:text-gray-100 dark:hover:bg-gray-900">
                  Dismiss
                </ToastPrimitive.Close>
              </div>
            </div>
          </div>
        </div>
      </ToastPrimitive.Root>

      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>
  );
};

export default Toast;
