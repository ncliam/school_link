/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$resUser', resUser);

  /** @ngInject */
  function resUser($request, $http, localStorageService) {
    var _self = this;
    this.user = localStorageService.get("user");
    this.fields = [
      "name", 
      "login", 
      "lang", 
      "login_date",
      "password",
      "company_id"
    ];
  /*  this.args = {
      active:true,
      company_id: _self.user.company_id,
      company_ids:[[6, false, [_self.user.company_id]]],
      email:info.email,
      image:"iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAIAAACyr5FlAABAkklEQVR4nO292ZIkR7IldlTNfIkt↵N1QV0AB6uSIzMiS/j+/8Hv4LX/g25JAUuXJ7BwpVlZmxupsqH1TV3KMKhYvuBlCRkDQsGYtv4XZc↵l6OL0f/+v/5veB7P4/sGf+oLeB6XO57B8Tw+Op7B8Tw+Op7B8Tw+Op7B8Tw+Op7B8Tw+Op7B8Tw+↵Op7B8Tw+Op7B8Tw+Op7B8Tw+Op7B8Tw+Op7B8Tw+Op7B8Tw+Op7B8Tw+Op7B8Tw+Op7B8Tw+Op7B↵8Tw+Op7B8Tw+Op7B8Tw+Op7B8Tw+Op7B8Tw+Op7B8Tw+Op7B8Tw+OvKnvoBfbhAz58S54ZyRE+WG↵c+ImK7EQKTERgQlEBCRmBqkULUXHgnHQYSjDSY7DeDrJOH7qX/NLjF8tOIiZiJASmDhlzpyaNndt↵7vvc97zouW1T13HfIycBI7GmZHsRcc7MChkGHQc9nPR4KLv9absdttvTdjfs92UYUUSlqIiKfOqf↵+7OMXy04cts2V5vm+prW67RctX3btG3TpqZt267NTZNy4pQpJ06Zm0xEAGD/h6qoiIgUKaJjGYfT↵eByOh+N4PJ2Op+PxOO73+vh4+va709u34/H4SX/rzzV+VeDglLjvuOvTarFYrfrb6/7urrm+zstV↵0+acUmLOOeXMOTETE5ECzJxzIgKpH0eBsYyliCpUVVRLKWWUoZRSpJQyjON4Gsq7+9313/ev3xwf↵H4ftrmx3Mg5Q/cFrfErjVwEOe+qJms1q+epV8/nnzYu71XK5WC6Wi0W/aNu2JWaCAoCLBt9VFICO↵43g+qaRQOyoTJaKcMlqtYkWBYRgPN5vDq8/2293ju8f9X/56/NOfj2/fjceDbfML/fafc/wawJFy↵btbr9OJu+eLF1Yu71csX/XrVNLlpcpNzkxMzA1BVVQVUFCoGFDXZoGJfBXQQ+sU+I1IFAcQAETEz↵QE0mpqZtl+vV1e3t/uZq+9nNw3dvdt9+N3zz7bjb6dPHx9MGBzHnvm+v1v2rV4t/+936xcvr1XK9↵XvZdAwBQKBQopTgItP4FKgAU4uAI2QAoaNo/ZpnsPyIiEIiJujYztbSi02a5fHHTv328/8tfd227↵+/bb4XGn4/CkbdWnDY52s776w2+7l6/6u7vbV3fL1bJtmpwSoD7fquJ6AIGJ6ZGuLyomYIaH6iRU↵NLZT+B/3dgkKZkosRCBg2Xfdi2bVt/fXV/d/+fv9n/58/Mtfy373y92On3o8WXAQpc2m//I317//↵/erVy261vFov2rYhhaqWYopCMRfu6v9RyAKahAKIoEr2mbqAwAxGGsdQKNT/QBQmGpiZmdsm89WG↵2y4v+rzo3rXN4a9/G+/vn6j8eJrgIMqLxeK3X2/+8Pur33y+udoslh0Tq6jITIHYqBqEQKYsCG5D↵UGDBhEXYqhUxTKQAiETETdS6sR9HR1EFSJRJEhMRL/u2zbeLvk+r1bvFYvv//n/j46Mh9Ze8Sf/6↵eJLgSJt1/9WXt//2+7uvPr+6ueralolVRWQChVbjkr7nCAYLVEkSEkPVd6xHcflBILU9KJQTTDTZ↵H4EKoRRilpwSp9StFp998aLJzE3e/vt/nL755smZqE8MHMTMbbv8/POrf/vDZ19/fn17s2hbEBVR↵iCpU1FzQydmYY0PdmgRVNRFyxWRB1TR0bpEQKASKTrCrZogqYOcnEVIBJ2Km5WpB6aW0HUEfh2F4↵uJfhKfHuTwwcqWvXv/nN1R9+d/vVF5ur675pAFWpJqNPm8+1exzA9HkMIq1bzt0QQMSMj2qlKiDx↵XlVBDjEFmAiqShCFMrH5NqMIg5jBRE1urq42+P0fhNPj//0/5Ls3v8Bd+qnGkwIHUbNaLb76zfUX↵r65vr/uuISJxmmK20Xs7/YgDV4/ErRKayxWtL+JdvMbZWU0BmaYpRUWUmQnUNs3iZjOUL8rDoxYZ↵7++fivHxdMDBnNq2vblefvH54vZ60XcEiEjV/46KcywQuYlgdKfGZu+pf5t1Pf8gXpgWqnvQzDWW↵OGn1ZaCqRCQqRZREmYhAXdusr66G3349lqKHg5xOT8L+eDLgIKL86uXqd7+7ffHZerUkwkRrxtzP↵N45XLgvcmKj4oWpUzFUQ3KQgmswJM1QYpOSu8fzogNL87OYFKamfQFQJykRt360+uynbLb17d/zu↵zZOI1T0NcBARd93i1cv1l1+sN8u2aYLkmpsRAMy/eE96fN8BZwaKuycEiqmfWatuoJoPSyFj4lNA↵3VKdqZxJKJBT80jMOaVusVh+diuPr8bT6UmA42lkglFO3WZ1dXe72qw5sUJCuU/Smdyr8Df1Q+e/↵Nd4CAkjoC8xEhqoaCEQhQXQ5mzG3SMKNVXFl5MFbca7dBIZzs4CoiopCc055s+Yvf0ObDfETuPNP↵4BIB8HLVvvpi8+JuvV4mTmESULU+IxsD5AzGhBGnuifWg2yEipnhiKrXApr7K/VQcU6K4wWX6odE↵BGXCZYbpJxVVUQLl3HTrTX97015tOKWf4179hOMJqBUiyleb7qsv+pvrRd/O9L0L/Mmq8C8mD3Yy↵MAC4tYjpWwqa69wcZafSVckd1+qk2AVVLVL1i0GklMn4xcyoqWRZYm5z7m9v5eFxPJ6w3/+Ud+qn↵HhcvOYgopW613NzdNF2LkOGYnAcKsxEAIvSB6Vn2w/hHWh95rRvXkFoQ73pOnQKKIFMUriTC8nDq↵7f2Yf4TsVEW0iJRSVISAlBJfXeHFHeXm5755/+K4eHAw82LRX61XV+smZ5y7nO6gzrIwZmaEy4yq↵BQIeZ4d/nxWZfzUTQmeC5fyU+t5Oc3S4G41IGhH1dLU+rdZp0XNKP3QFn3pcOjgopXx93d3cLJd9↵2ySKBC28776GqUBElkc+IcMhMdkK9QDnBoO/4ckiiR2UKuAIXE8AJRAzMQffQajwU1dZtgFVXcSM↵nLntu26zzn1/udC4fHBw0zYvX7S3t23OzBThLgCm0l2hhJUxceEVQrapEVW+ifrkaw21zccseqqh↵xDCpj5lCiyFT3MXCfzLRZJE5gPBxiSgx57ZLt7e8WT9Ljn9+cNu0t3fd1SbnPLGc74Xj483MrZ28↵jwk1ho+wJ8LHrfvYwatNgzAipxPq3EKBCZS6S6iouv/k8ur8FMaJUc58c0PriwbHBXsrRABy2ywW↵XZOzyXqFTvZF5cu1vqXwQiNIQlMUTV1mTFw5BU86EzrObCDUCTukVAFiY+MjVXnyimZELTNULY8s↵MalaJE+JYJJPoCBwZlosqOtBDJRf4n7+4+NyJQcBqclNv+gXfdtkvCczPoiPTBTV7KOJAJvExLmr↵+/GhlTijyXANYTEdeUrvkJAg8+ugyrhMdikAIqacuWu5jZKZyxuXCw4Fcdfn1bLvu9ykM2tjemDP↵9IqbC5HtN8ePVEF/PhEzlaFnx58nGVa9FWaE4626vYrKdHmEWM3EoXoQtdCMQARQMCExp6Zp+p7S↵hcrvywUHEbTveb1uF12b8/cGTKrjeP7w6Yy6nI421y7z+a5HoBnM3JENy4Rm55orkWkvy0Z3X0WJ↵YA5Kpc+IrarBXRsipES5a9NqRc2FUqWXCw4AWPS8Wee2SSl9KHo/kMY6f6WzVzUyMv8Gk7nxngqI↵43/Pgc/OMPeLCSCefCSQUrVVZvaoWR6mp5g5dx2v1pTbH74Nn2pcqEADoER5uUpXG0o5Eq58et0J↵UUWkds5nwJO1WBVE1e0wIlXDnj1zUlF1Tv0ScQo/fq17qo6MXwBVgFEoGovrykSbWjqIJ5+ASEFE↵lDhR32O9RnOhVOnlgoOZU9vmvuf0gXijmVaYXrqjaC5rrT+BVvtD5+4uMHk6HwxyhOgZ7DBZMVTt↵FwvyAxOJXsk1uyz1WinzjewtMbGyUNPocol8obNwoZcF40abpsmJJoMf+B5t4n6nCxBVYhBmobIZ↵/QDMXWEQSJzgtviazS2AKRY32RcKEJRIVZkw5aVb+rFZojOmhUFKEIepeblu5ZIZKEJKhLZFvlCb↵40LBQcwp59ykxCnysjR4CRcFddbDo3AdAQlhEXixzRA+7SQOaLafRupQ9VNm+eYf+ElVBikAmWkd↵AOIprU7EhnM7UWJWXyMqAJjJ2PUPPPNPPy4YHF2bm5wSh1aYQmr6oUJQPTMnAwVTRcF73u9s0ykU↵Uh3dOTJmkKohF3eZI0yrNbpbv52JkKpeAhpxRLiNyilRSloKLgwflwqOlLhtU9OkxJXp1mBEgVnJ↵M5m5MbkJ9fnHecsNn2DTOfEFqT/Tvln1c2kSOmSMt8+oCzInvWZONREJFFCuBVBQBTiRBVsqeNn8↵X+8jxNQ03GRLfPzpb+W/MC7UlaXE3PepaxMzzZ5UtQzBKkDmPms8jgKNDL6IrM2ckgiPTPamxtFD↵8Fc7Y1I+58xsZCnOAjGYSzK7Oomzqs63qSrIDA9mpJz4InM7LlVy5EyLRUgOm8zqLBCTepzFH90I↵e82syCr//YBzTVRdTHMyK+Gh9a8fzfbUgFGVGfUIQBgo73MuBgiqrys+xOlat5SYOTVNaRva86XV↵W18oOJBy6hfZJQfVGZ9l4Gmti0bYlBREqIbF8SETOpkSU5J5kO1VR4QnWxXaHHful86UVODHPdiZ↵8eGfMEMExnNYSzoxx4rIivMpN+/D6wLGxYIjoeuoaZhrio7gfKoV1W0BXHrU+Q246Nkt/0AFTT7K↵e0Pn24W4CFPTLQ+7osjiiR2r01IdqRmRCiNSRUnJwEGJ0bTUNvqBi/7Jx6WCg1n7DjkTMSbtME2N↵85EAZgSIExmRmTHXLBSR93A+40QhDTRsXp1NqkaktWoF10cVgURqhQ4KeG2mbYZqxgD63rRbeE5j↵L8oZTUNEissaFwoOZRZOSkw8Bdeq1/meitczBTJzMePL+kWIiw/2mUfjtOoXy1U/c35NTtgH…OK0jdzdClWqI1VNuDrVFfXyEooVZTYLsmnmWanoLN2qHAlKKgSDk7e296+Si3C3xbTOqCm↵yX3iUiQl5qZtrq5O24O8We+Xi7F/S/sdjody+inN1Z8GHPYEcNv01zft56+ar77krmu79vZms1ot↵mMkWORhG9z6LqKr4zInfbykSKJGpK1e9a0TJV5Um1/ixsKOK+pp7JrPVSZHaVrAeR0RTgvuojiSf↵GJdYicj7oAOAFgETE9UGo7AlEHwFKPIkkNrg1oCYvIA73CjSaGRLTCl5Iyqv5S3gZKntasrULqwU↵LQWRKE9moIsyFIuuWS46KbLbHd6tF3J9LS/u8+vX+vq7w7t3Mgw/FS/y04Ajd1338kX38kVpu+b6↵+vrVi7Zt2yYtFl2Tk/uiomMpPiVQmAggsNUnhpI3wsA6s4nAe0VOvTWQsrXc8FMTAYmTV0fbEkw+↵Vda9iZNVzJOG50pEKcFbmRd4zZN/VVWGW6YUF8maTADobKE4EzUps3eKmgh4io7b0fYhvCETe7BG↵IOr/EVHKVJXOvAxLoq1qdKdBStww58zLVZ9yWiz7w83Vfr0cbm+a7e70zbfD6++G409QG/EvgYOI↵Ut+lrk+b1ep3Xy9/+/Wg1DTNZrNadBZZmKgqqylVaO3AZIeIV0rTfNcn1zQCm+ao36OynrWmhEFE↵RnuYNK5PDk3rb5A1DItbDyiZ15NS+L1nqX11SQ2qPkiBQtQicLPtZ5emiIWkTMaQqjATp9kaMMHL↵6GRYY6Jm/JJSvMRE+jna2BQlM69X/WLRHY/9fduc7m71NOwX/ZaJH7bleCj/WvPCfwkc3Lbrr79q↵X744tB1fXy3Wq7u+sxA5gHEsEmn+dtfEmwB7bwsXv0XdFLVSxGLxNEvgsJmMnhlMNGkEt1erj5qT↵OSD1ONbZhywsBxfXJApyE9VMWvMzyZdUSrFvwG5+SRwrKFAUuXiYtxJnZ5eElHkK5dkpyH+1e+YA↵lESM7QfzrF0unOQxet44QBNPIhAZiCmlpE0CKHG6u16PRQ774ziWpl8sD/vhm28f/+NP5XT8p+f3↵nwRHu1jkq0374rPFq1ft3c1qsei7brVcWOCgFBlHiSV2J7svZK1rEZPi4i1SpsIyuICHC1aKZn72↵PcfTOXkzoUYA4xwVVUkRE4Tm9eLVCiGCt+egyQx28ymu8uzoZmIoa1xS6KI4u5sYVH8rEXlWmak9↵CuVYRWPVZfUGsa9ESl6jp3EjqkNnHYoAQOxqiShnz0K5/uy2X6/LbnvserTt6fV34/3DcPhnwnj/↵IDiIiDn3fXdzs/zdV4vffk256dvm+uaqbRsyU62IFBURC4bVqQIwrX4VvzXUP6xCtYpW3z446Upe↵YiZ77WFKoaTMSzUFAW+A77eOvUmYiCj74+9j5n9qWBjE2TVXKUJEdRsg3GzXQe7Vpvhd5oS5ezGd↵wo/mWD+7pHO32c5Q1xOqQAKFltHafJeitSGRMvMwKjM1Od1erUuR+yZx37ev7g7/8ef9f/xJ374t↵h4P+g/kA/xg4CFh/8ap79XlZLNOL2+XVVdc2Xds0TQasmYm39Huv04Hd02rAuzsZPiEzgUHqpkDU↵r0IFErxoJGu5+AXDVkmxJX1VvQO+ROCcnZScuHB4cihs1Xv73NcC9odTYxYRNqlTKnXp0Klbg+uj↵CMRQuLKKuob5tJj5dNjpdCa0APNfEJd0NoPzU3ACh2FE7ASuKqlSEWWCZUFTUk60Wi/brj2N/Xgc↵Uso3uxeHv/19+5e//kMGyI8GB5ELjK+/7n7zhXTdYtGvlt2i6zhxKaXmViHMtLgXcGKKIFTFvf/I↵oDDqzfK7gdqe3nmDyVz1hA3X5WCCqGd82WMWJg6BZpdv0RZGFTSmcSYr16Ewm5RJ6UzbxC86+7y+↵jdDr1M80jlzBR/ObQyAkmsu+uCSd7Qj7MSZQEpvoQUH41aoQS14S66PJzF2b2yY3wzDc3dBiwYdD↵altVHN++HQ+HHyk/fhQ4iCi1zfrL31z9T/8Vi2Xuutub9cKLOCBSSinGGHAYAxHjDEVuJKE7ERoJ↵ub7ihSsPU8wRBiWwPSJwW9amn8OJUJ5cWtPlCJ+CBCpFq8CYJkOrZPKugImd6rAP03lojWI9jVjL↵hRJXokxtzZ6YbZh1gZpsRPWS/PcVsV/FdXsDdxUO5Kc4u6SwWAKwyfCiRIjVME29xY1VMMgCQH3X↵vMxX+8Xx3btEX3/d3d3d/1//4/FPfyyn4cd4MT8CHETtarn67VfLr7/qPrvLbdu3zXLZ55RUEE2x↵1CbX+rbWR6qKUI2O08YYG20YlGLsoFo3Q9S/h2tgtyPEiqNCLUfPtZShyJ54s3OJiGKp8SA5rfWk↵PcWmv3zpP+8xynHZPmlTk0m/QNh8iIIEtiJglOr7aqbiwPNfF6wHkQpVblfhirA2w5xdktlqcHXp↵L6ebMd0zv6oql+zcat4NU0op57ToO1GcTt247Nfj77lrH//4x9Pj9j+VH/8JOIgo9X338sX1f/tv↵/d0NMW/Wy2XfaqzCDe+wFr9NACBxNNybeRQhjsP29qc92GN/lmeA9gU57YkJMYwKMtYgV2ESOE4W↵wtyHBf1TsLSom9n/VNUMRF95yfr9hMkSAiZ+R+VbiImUZAKTNcf1VOWqfDChw9aUIiJiS2e0EKDU↵2xJBgvBPmCFq8lOD16FYCXvyuWaTNflA01Z2Kzar5SGftjtdf/1Vs1qNh72MpRwOPyw//jPJwZxf↵vmz/8Idms1ks+r5vm5Tm5KyG6PPrC/HLzlJAJvEbK7fWZQnqcic21ORrLBY/WfAEaKLkSjj2sCoz↵N38t/XOacco1WSv+MaMfEfw0CwRhviTmeNwj8u4gRuhBXwc0vAitXop6IhllZrO9BWIIq1sD4dWY↵B+daE0TJICTeD3k6BVEya0PCnWUiomQAV3HzYpIhqBybsT2xvBkxEXVtQ0SnYRzXm/YPfzgJyh//↵iB+sjfghcFDK7Wa1/M3n6y9/0y/7Rdf2XVPEOsP7rMR81wf3zEhzKyTk5CQl6tMQ4rfuYM86TYvS↵+511JyisvBmqpq7Tjke3GEhDRFSYMCxYC1FwvSS/antkNS4cptepuhDwBGON46N6UrE9Ii5DyuKr↵CE6nCAL/bDYtuqwgQJgmbje0EtW9QW5tMUBEBQJ1UmS6ry6gLUYDUSUFkTKEyHNEyqJdfvF52e70↵3dvTw1Y/vvbxD4Ej9d3i1avrl5/dXK8XfZubZKvOWOG5Tut9T4GeKtZ8OvxBmMwlAojJ+26FzlF/↵DuCZt6FIPKBKVJ/duUVit4mZiAEJGyFWVKnJEw4mn1VlW528mMBwy4aJZEoIsnn3H5Hch3IrVULp↵6MweObukev2x7NyHlzQpKrtCNqFKge94yGgiW2fGkJvJ7DSLP6XVbZ5fk9O+LNXtzplXi46I8OJW↵374qw5/H7T8FDmrbdHfbXV31fZtzqsbg3KmYRCBNoKgPht3RSKWYVsJi98xCg5L3vJy8tfnDbBLW↵rQFynjFM/vBq7O4DYuraoihn8skdCtci1c/UoJSs3bktAYnaQsFn2vvr10efGC7gjdsAIegxmzYi↵Up5vT/ATqGcJVcfIXkzMWQEA4slrslNUsysuicyoFUwfTu12XbPY5Lixhqi/alLO63W6u6VvvsV2↵+0+Bo8lYb3jRJ2ZodNx7bxtQ/VGI3JZogIKZParhcfhMxQJYEMQKjJUgmRmviL/+rCiMeJ2RlnO9↵gcDJdFGW7JMmEwRAxEQVkdMXIAMo4jizdWUDFs7Fad3e3lin2zTbof7Uya0wIsTOL1BSrrfJUQjM↵7XMQEYLvtWhzDR5P29tbPt8eILukulq331K1Yh8AoK7DekNNg4+PHzRIOXHX2l0uIibbPMiktsgm↵SWhFC0LOjHrnBDFRhFBb1zOUosfi1cQ4iajxYNawDzB3f5L2FtyP20J1eXpVzHItrJGo375YIsOs↵HBWZ6MtJ9AECEzmgVIUVlKiSJVNGqgIgFRTys0+IJqpEqqqXNvr20yWR50ErQGxehasMZzwd635j↵o2sISKNextwr+9WTi2aGFELpUGSXiUeqodBSKoENAnHb0jxC/o+Bw+0lClPNvS/U5yesaJ8JAlfx↵q9boc1o7nCZenJy+DGFOVVZUDcVhcM+eIwqlE+JhZjw6kzopr3qbLFYeN8uJfJ4Wu1fMdKORWJSq↵HnFLgIyIhVvSFaT+LMd8IMQRoV7etH1cks2I/wCtHAmzPU6T7g71YeZLpC26U6OABA2oM3LX26Gx↵uqALVoRCMalFhZjJ8iL/CXBQNLdwM6l+SD5jIlIUiVE/id/kkiEQ40fQwLYv813PpA4N4vDlkpM+↵1rjNQmVV6YQVpjF/njtjdrGL31r5igAAWYQdbpDEQaxVA9f8gBDj9q31O3af2UJlzpqcXVI8qcpQ↵2II+sRyDqIpMZRBnigSuLIjDEiJopLFZCmr9EZVudm+ILYueAau9i3B0XBIjMpZZ2GgbDqtMMLoN↵Bk6JpnyXHwcOTqnbrPqbK2+9aE+Xhs9A9dmIpVsD7FEm7uFsFc+xnjBntpFqaJN4Dc+1jFoBFxUa↵kgnTE+hKh+IXVfZwbm1McscMRo2pD/FrWI//puQg1bAxYQ+eKQsKe5Dms1snw3+4ntmPCFMR/nhU↵/T+FnAhwdi7Msfoczsx7u+w6hbHSIPmNCgINmFkYfhlw02fmKRm+iDktrje03Rwfvr+xzPeDg5i7↵1apbr5DYNbrdAq3Se7pHrvwICP5u+g0+dRrVxnFPxWgrRkBvNs/1J8AtBbNYxGIGdLb9DGc0fyod↵dOBZBZtfUqhpovNLmk3FbIeaBF8VosHYjcSIxE7OO4JpUI3IThAhthHz2SVRPYWq1U1M02xmmhlJ↵c2TMpS5RsDtULymEqG9PdvtUJaxkP0fibr3S1eq03X8vG/b/A1jMx0dMDpArAAAAAElFTkSuQmCC↵",
      in_group_58:true,
      lang:"en_US",
      login:info.login,
      name:info.name
    };*/
    this.domain = [["share", "=", false]];
    this.model = "res.users";
    this.offset = 0;
    this.sort = "";
    this.limit = 80;

    this.getListEmployee = function(info, callbackSuccess, callbackError){
      var path ="/api/search";
      var param = {
        model: _self.model,
        domain: info.domain || _self.domain,
        fields: info.fields || _self.fields,
        offset: info.offset || _self.offset,
        limit: info.limit || _self.limit,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid
      }
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.getUserById = function(info, callbackSuccess, callbackError){
      var path ="/api/search";
      var param = {
        model: _self.model,
        domain: [["id", "=", info.id]],
        fields: info.fields || _self.fields,
        offset: info.offset || _self.offset,
        limit: info.limit || _self.limit,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid
      }
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.checkGroupForUser = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"has_group",
        args: [info.group_name],
        kwargs: {}
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.changePassword = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"change_password",
        kwargs:{
          context: _self.user.context,
          old_passwd: info.old_passwd,
          new_passwd: info.new_passwd
        },
        args:[]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.createUser = function(info, callbackSuccess, callbackError){
      var accessTeacher = info.accessTeacher;
      var args = {
        active:true,
        company_ids:[[6, false, [_self.user.company_id]]],
        group_id: [6,0,[accessTeacher.id]],
        email:info.email,
        login:info.login,
        name:info.name,
        password : "123456"
      };
      args["in_group_" + accessTeacher.id] = true;
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"create",
        args: [args]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.getListUserForChat = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"im_search",
        args: ["", 100]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.updateStatusForChatById = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"write",
        args: [
          [_self.user.uid],
          {
            im_status: info.status
          }
        ]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.signup = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: {verify_phonenumber: true},
        sid: _self.user.sid,
        method:"signup",
        args: [{
          login: "0986364869",
          token: 7
        }]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.getChatNameByUserId = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"get_chat_name",
        args: [
          info.user_ids
        ]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.getStudentById = function(info, callbackSuccess, callbackError){
      var fieldsStudent = ["id","name","class_ids"];
      var param = {
        model: "hr.employee", //"res.company"
        args: [info.student_ids, fieldsStudent],
        method: "read",
        session_id: _self.user.session_id ,
        context:_self.user.context,
        sid: _self.user.sid
      }
      var path ="/api/callKw";
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

  }
})();
