export const Errors = {
    0: {
        Error: false,
    },
    Body: {
        ArticleExists: {
            Error: true,
            ErrorDetails: {
                General: "Article already exists",
                More: "C'mon! Be more original.",
            },
        },
        Credentials: {
            InvalidFormat: {
                Error: true,
                ErrorDetails: {
                    General: "Given password is in invalid format",
                    More: "Passwords must be 8 - 64 characters long and contain only A-Z, a-z, 0-9, `~!@#$%^&*()-_=+[{]}\\|;:\",<.>/? and space",
                },
            },
            InvalidType: {
                Error: true,
                ErrorDetails: {
                    General: "Given password is not a string",
                    More: "Make sure you're giving string as password",
                },
            },
            Wrong: {
                Error: true,
                ErrorDetails: {
                    General: "Given password is not correct",
                    More: "Make sure you're not misspelling it and not hashing it.",
                },
            },
        },
        InvalidType: {
            PageSizeOrCount: {
                Error: true,
                ErrorDetails: {
                    General: "Property Paging.PageSize and Paging.Count must be of type Object",
                    More: "Make sure the page size and page count is a number, not a string, object or boolean",
                },
            },
            Selector: {
                Error: true,
                ErrorDetails: {
                    General: "Property Selector must be of type Object",
                    More: "Make sure the selector is a object, not a string, number or boolean",
                },
            },
        },
        Missing: {
            Credentials: {
                Error: true,
                ErrorDetails: {
                    General: "Missing crredentials",
                    More: "Make sure you're providing credentials",
                },
            },
            Selector: {
                Error: true,
                ErrorDetails: {
                    General: "Missing property Selector",
                    More: "Make sure you're providing selector and you didn't misspelled it",
                },
            },
            UserId: {
                Error: true,
                ErrorDetails: {
                    General: "Missing UserId",
                    More: "Make sure you're providing user id",
                },
            },
        },
        MissingAny: {
            Error: true,
            ErrorDetails: {
                General: "Some properties are missing",
                More: "Make sure your request includes them.",
            },
        },
        MoreOrLessThanOne: {
            Articles: {
                Error: true,
                ErrorDetails: {
                    General: "More or less than one articles found",
                    More: "Specify your selector or make sure the searched article exists",
                },
            },
            Likers: {
                Error: true,
                ErrorDetails: {
                    General: "User already liked article",
                    More: "C'mon, don't be silly!",
                },
            },
            Users: {
                Error: true,
                ErrorDetails: {
                    General: "More or less than one users found",
                    More: "Specify your selector or make sure the searched account exists",
                },
            },
        },
        UserExists: {
            Error: true,
            ErrorDetails: {
                General: "Username already taken",
                More: "C'mon! Be more original.",
            },
        },
    },
};
//# sourceMappingURL=errors.js.map