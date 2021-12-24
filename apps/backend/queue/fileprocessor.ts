import Queue from 'bee-queue';
import { Job } from 'bullmq';

const queue = new Queue<string>('Paint');

const job = queue.createJob('tst');

job.save();



queue.process<string>((job: { data: string }, d: (e: Error | null, x: string) => void) => {
    console.log(`Processing job ${job.data}`);

    setTimeout(() => {
        d(null, "yes")
    }, 3000);
});

queue.on("job succeeded", (id, e) => {
    console.log(`Job succeeded ${id} ${e}`);
})