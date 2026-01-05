import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ErrorMessageProps {
    message: string | null;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <AnimatePresence mode="wait">
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200"
                >
                    <AlertCircle className="size-4 text-red-600 shrink-0" />
                    <p className="text-sm text-red-800 font-medium">{message}</p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
