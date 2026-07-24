/**
 * Lightweight in-process email queue with retry logic.
 *
 * Processes email jobs sequentially. Does NOT block the
 * caller — jobs are enqueued and processed asynchronously.
 *
 * Retry: up to MAX_RETRIES with exponential backoff.
 *
 * Production note: For multi-server deployments, replace
 * with BullMQ + Redis worker. This implementation is
 * designed for single-server architecture.
 */

const MAX_RETRIES = 3;

const queue = [];
let processing = false;

/**
 * Add an email job to the queue.
 *
 * @param {Object} job
 * @param {Function} job.handler — Async function to execute
 * @param {string}  job.label   — Human-readable label for logging
 * @param {number}  [job.attempt] — Current attempt number (internal)
 */
export const enqueueEmail = (job) => {
    queue.push({
        ...job,
        attempt: job.attempt || 0,
    });

    if (!processing) {
        processQueue();
    }
};

/**
 * Process queued jobs sequentially.
 */
const processQueue = async () => {
    if (processing || queue.length === 0) return;

    processing = true;

    while (queue.length > 0) {
        const job = queue.shift();

        try {
            await job.handler();
            console.log(
                `[EMAIL_QUEUE] ✅ ${job.label} — succeeded (attempt ${job.attempt + 1})`
            );
        } catch (error) {
            const nextAttempt = job.attempt + 1;

            console.error(
                `[EMAIL_QUEUE] ❌ ${job.label} — failed (attempt ${nextAttempt}/${MAX_RETRIES}):`,
                error.message
            );

            if (nextAttempt < MAX_RETRIES) {
                // Exponential backoff: 1s, 4s, 9s
                const delay = nextAttempt * nextAttempt * 1000;

                console.log(
                    `[EMAIL_QUEUE] ⏳ Retrying ${job.label} in ${delay / 1000}s...`
                );

                setTimeout(() => {
                    enqueueEmail({
                        ...job,
                        attempt: nextAttempt,
                    });
                }, delay);
            } else {
                console.error(
                    `[EMAIL_QUEUE] 🚫 ${job.label} — all ${MAX_RETRIES} attempts exhausted. Giving up.`
                );
            }
        }
    }

    processing = false;
};
