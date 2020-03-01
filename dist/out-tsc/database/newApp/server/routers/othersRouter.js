import { __awaiter } from "tslib";
import { Router } from "express";
var Changeables;
(function (Changeables) {
    Changeables[Changeables["Title"] = 0] = "Title";
    Changeables[Changeables["Content"] = 1] = "Content";
    Changeables[Changeables["UserId"] = 2] = "UserId";
})(Changeables || (Changeables = {}));
export function GetOthersRouter(db, e, cc, prg) {
    return Router()
        .post("/checkCreds", (req, res) => __awaiter(this, void 0, void 0, function* () {
        res.send(yield cc(req.body.Credentials, db, prg, e));
    }));
}
//# sourceMappingURL=othersRouter.js.map