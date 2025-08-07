interface JobHandler {
    handle(): Promise<void>;
}

export default JobHandler;
