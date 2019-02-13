// tslint:disable:variable-name
// tslint:disable:no-unnecessary-class

declare global {
    export interface StringConstructor {
        format(str: string, ...params: Array<any>): string;
    }
}

String.format = (str: string, ...params: Array<string>): string => {
    const regex = /{[0-9]+}/g;
    const matches: Array<string | number> = str.match(regex);

    matches.forEach((value: string, i, arr) => {
        arr[i] = parseInt(value.substr(1, value.length - 2));
    });

    const split = str.split(regex);

    matches.forEach((value: string, i) => {
        split.splice(2 * i + 1, 0, params[value]);
    });

    return split.join('');
};

export class Constants {
    // tslint:disable-next-line:max-line-length
    public static readonly CouldNotGetTestMethodError: string = 'Could not get current test method with caller recursion depth {0}. Refer to https://github.com/karanjitsingh/jstestcontext for correct usage.';
    public static readonly TestAttachmentDirectoryError: string = 'Could not get test attachment directory: {0}';
    public static readonly PathIsNotAFile: string = 'Given path is not a file.';
    public static readonly CouldNotCopyAttachmentError: string = 'Could not copy attachment: {0}';
    public static readonly AttachmentDoesNotExist: string = 'The file {0} does not exist.';
}